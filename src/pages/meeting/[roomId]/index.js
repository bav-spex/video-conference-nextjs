import React, { useEffect, useRef, useState } from 'react'

import { Box, Button } from '@mui/material'
import Topbar from 'components/Topbar'
import { useAppDispatch } from 'hooks/hooks'
import * as mediasoupClient from 'mediasoup-client'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import io from 'socket.io-client'
import { markUI } from 'store/ui/uiSlice'
import { v4 as uuidv4 } from 'uuid'

// const SERVER = "https://localhost:3000"; // your HTTPS mediasoup server

const SERVER = `https://${process.env.NEXT_PUBLIC_LOCAL_IPV4}:${process.env.NEXT_PUBLIC_BACKEND_PORT}` // your HTTPS mediasoup server

const Meeting = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const roomId = router.query.roomId

  // DOM refs
  const localVideoRef = useRef(null)

  const leavingRef = useRef(false)

  // signaling + mediasoup
  const [socket, setSocket] = useState(null)
  const deviceRef = useRef(null)
  const sendTransportRef = useRef(null)
  const recvTransportRef = useRef(null)

  // local media
  const videoTrackRef = useRef(null)
  const audioTrackRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const videoProducerRef = useRef(null)
  const audioProducerRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [micMuted, setMicMuted] = useState(false)

  // remote media (tiles)
  const [remoteMedia, setRemoteMedia] = useState([]) // [{producerId, owner, stream}]
  const [loadingProducers, setLoadingProducers] = useState(new Set())
  const consumersRef = useRef(new Map()) // consumerId -> consumer

  // peers & producers metadata
  const [peers, setPeers] = useState([])
  const [producers, setProducers] = useState([]) // {producerId, owner}
  const [broadcastSet, setBroadcastSet] = useState(new Set())

  // To Highlight ActiveSpeaker
  const [activeSpeakerClientId, setActiveSpeakerClientId] = useState(null)
  const audioAnalyserRef = useRef(new Map()) // producerId -> { analyser, dataArray }
  const audioProducerOwnerRef = useRef(new Map()) // audioProducerId -> ownerClientId
  const audioContextRef = useRef(new Set())

  // identity / role
  const [clientInfo] = useState(() => {
    let clientId = sessionStorage.getItem('clientId')
    let displayName = sessionStorage.getItem('displayName')
    let role = sessionStorage.getItem('role')

    if (!clientId) {
      clientId = uuidv4()
      sessionStorage.setItem('clientId', clientId)
    }
    if (!displayName) {
      displayName = 'User-' + clientId.slice(0, 5)
      sessionStorage.setItem('displayName', displayName)
    }
    if (!role) {
      role = 'attendee'
      sessionStorage.setItem('role', role)
    }

    return { clientId, displayName, role }
  })
  const isHost = clientInfo.role === 'host'

  useEffect(() => {
    const refreshOnce = () => {
      if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true')
        window.location.reload()
      }
    }

    window.onerror = refreshOnce
    window.onunhandledrejection = refreshOnce

    return () => {
      window.onerror = null
      window.onunhandledrejection = null
    }
  }, [])

  // ---------- main effect: connect socket & join ----------
  useEffect(() => {
    const s = io(SERVER, {
      transports: ['websocket'],
      withCredentials: false
    })

    setSocket(s)

    s.on('connect', () => {
      toast.success('Connected')

      s.emit(
        'joinRoom',
        {
          roomId,
          clientId: clientInfo.clientId,
          displayName: clientInfo.displayName,
          role: clientInfo.role
        },
        async res => {
          if (!res) {
            toast.error('No response from server')

            return
          }
          if (res.error) {
            toast.error(res.error)
            setTimeout(() => router.back(), 1500)

            return
          }

          try {
            await setupMediasoup(res.rtpCapabilities, s)

            // get current producers and auto-consume
            s.emit('getProducers', { roomId }, ({ producers }) => {
              if (Array.isArray(producers)) {
                setProducers(producers)
                producers.forEach(p => consumeProducer(p.producerId, p.owner, s))
              }
            })

            toast.success('Ready')
          } catch (err) {
            console.error(err)
            toast.error('Setup error: ' + err.message)
          }
        }
      )
    })

    s.on('connect_error', err => {
      console.error('socket error:', err)
      toast.error('Socket error: ' + err.message)
    })

    // peers updates
    s.on('peers', list => setPeers(list || []))

    // producers updates
    s.on('producers', list => setProducers(list || []))

    // new producer that this peer should try to consume
    s.on('newProducer', ({ producerId, ownerClientId }) => {
      consumeProducer(producerId, ownerClientId, s)
    })

    // producer closed permanently
    s.on('producerClosed', ({ producerId }) => {
      removeRemoteProducer(producerId)
      setProducers(prev => prev.filter(p => p.producerId !== producerId))
      setBroadcastSet(prev => {
        const copy = new Set(prev)
        copy.delete(producerId)

        return copy
      })
    })

    // broadcast state changed (only visibility, producer still alive)
    s.on('broadcastChanged', ({ producerId, broadcasting }) => {
      setBroadcastSet(prev => {
        const copy = new Set(prev)
        if (broadcasting) copy.add(producerId)
        else copy.delete(producerId)

        return copy
      })

      // If broadcast stopped, attendees should remove that tile.
      // Host keeps seeing it.
      if (!broadcasting && !isHost) {
        removeRemoteProducer(producerId)
      }
    })

    return () => {
      try {
        s.emit('leave', { roomId }, () => {})
      } catch (_) {}

      cleanupLocalMedia()
      cleanupConsumers()

      sendTransportRef.current = null
      recvTransportRef.current = null

      s.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  // ---------- Active speaker detection loop ----------
  useEffect(() => {
    const interval = setInterval(() => {
      let loudestClientId = null
      let maxVolume = 0

      audioAnalyserRef.current.forEach((entry, producerId) => {
        const { analyser, dataArray } = entry
        analyser.getByteFrequencyData(dataArray)

        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length

        if (volume > maxVolume && volume > 20) {
          maxVolume = volume
          loudestClientId = audioProducerOwnerRef.current.get(producerId)
        }
      })

      setActiveSpeakerClientId(loudestClientId)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  // ---------- Resume on first click anywhere -------------
  useEffect(() => {
    const resume = () => resumeAllAudioContexts()
    window.addEventListener('click', resume)
    window.addEventListener('keydown', resume)

    return () => {
      window.removeEventListener('click', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [])

  // ---------- mediasoup setup ----------
  async function setupMediasoup(routerRtpCapabilities, s) {
    const device = new mediasoupClient.Device()
    await device.load({ routerRtpCapabilities })
    deviceRef.current = device

    // send transport
    const sendParams = await new Promise((resolve, reject) => {
      s.emit('createTransport', { roomId }, res => {
        if (!res) return reject(new Error('no response'))
        if (res.error) return reject(new Error(res.error))
        resolve(res)
      })
    })

    const sendTransport = device.createSendTransport(sendParams)

    sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      s.emit('connectTransport', { roomId, transportId: sendTransport.id, dtlsParameters }, res => {
        if (res && res.error) return errback(res.error)
        callback()
      })
    })

    sendTransport.on('produce', (params, callback, errback) => {
      s.emit(
        'produce',
        {
          roomId,
          transportId: sendTransport.id,
          kind: params.kind,
          rtpParameters: params.rtpParameters
        },
        res => {
          if (!res) return errback('no response')
          if (res.error) return errback(res.error)
          callback({ id: res.id })
        }
      )
    })

    sendTransportRef.current = sendTransport

    // recv transport
    const recvParams = await new Promise((resolve, reject) => {
      s.emit('createTransport', { roomId }, res => {
        if (!res) return reject(new Error('no response'))
        if (res.error) return reject(new Error(res.error))
        resolve(res)
      })
    })

    const recvTransport = device.createRecvTransport(recvParams)

    recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      s.emit('connectTransport', { roomId, transportId: recvTransport.id, dtlsParameters }, res => {
        if (res && res.error) return errback(res.error)
        callback()
      })
    })

    recvTransportRef.current = recvTransport
  }

  // ---------- local media ----------
  async function startCamera() {
    try {
      resumeAllAudioContexts()

      // get ONLY video if mic already exists
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: !audioTrackRef.current // only request audio if not already active
      })

      const videoTrack = stream.getVideoTracks()[0]
      const audioTrack = stream.getAudioTracks()[0]

      // ---------- VIDEO ----------
      videoTrackRef.current = videoTrack
      setLocalStream(new MediaStream([videoTrack, ...(audioTrack ? [audioTrack] : [])]))

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream([videoTrack])
        localVideoRef.current.muted = true
      }

      if (videoProducerRef.current) {
        await videoProducerRef.current.replaceTrack({ track: videoTrack })
      } else {
        videoProducerRef.current = await sendTransportRef.current.produce({
          track: videoTrack
        })
      }

      // ---------- AUDIO ----------
      if (audioTrack) {
        audioTrackRef.current = audioTrack

        if (audioProducerRef.current) {
          await audioProducerRef.current.replaceTrack({ track: audioTrack })
        } else {
          audioProducerRef.current = await sendTransportRef.current.produce({
            track: audioTrack,
            appData: { mediaType: 'audio' }
          })
        }

        setMicMuted(false)
      }
      setCameraOn(true)
      toast.success('Camera started')
    } catch (err) {
      console.error(err)
      setCameraOn(false)
      toast.error('Failed to start camera')
    }
  }

  function cleanupLocalMedia() {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop())
    }

    setLocalStream(null)

    // DO NOT close producers → just remove their track
    if (videoProducerRef.current) {
      videoProducerRef.current.replaceTrack({ track: null })
    }

    if (audioProducerRef.current) {
      audioProducerRef.current.replaceTrack({ track: null })
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    toast.success('Camera stopped (producers kept alive)')
  }

  function stopCamera() {
    // stop ONLY video track
    if (videoTrackRef.current) {
      videoTrackRef.current.stop()
      videoTrackRef.current = null
    }

    // detach video from producer (producer stays alive)
    if (videoProducerRef.current) {
      videoProducerRef.current.replaceTrack({ track: null })
    }

    // update local preview
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    // update localStream without touching audio
    if (audioTrackRef.current) {
      setLocalStream(new MediaStream([audioTrackRef.current]))
    } else {
      setLocalStream(null)
    }
    setCameraOn(false)
    toast.success('Camera stopped (mic unaffected)')
  }

  function toggleMic() {
    resumeAllAudioContexts()
    if (!audioTrackRef.current) {
      toast.error('Mic not started')

      return
    }

    audioTrackRef.current.enabled = !audioTrackRef.current.enabled
    setMicMuted(!audioTrackRef.current.enabled)

    toast.success(audioTrackRef.current.enabled ? 'Mic unmuted' : 'Mic muted')
  }

  // ---------- remote media / consumers ----------
  function cleanupConsumers() {
    for (const consumer of consumersRef.current.values()) {
      try {
        consumer.close()
      } catch (_) {}
    }
    consumersRef.current.clear()

    setRemoteMedia(prev => {
      prev.forEach(m => {
        if (m.stream) {
          m.stream.getTracks().forEach(t => {
            try {
              t.stop()
            } catch (_) {}
          })
        }
      })

      return []
    })
  }

  function removeRemoteProducer(producerId) {
    // close consumers for that producer
    for (const [cid, consumer] of consumersRef.current.entries()) {
      if (consumer.appData && consumer.appData.producerId === producerId) {
        try {
          consumer.close()
        } catch (_) {}
        consumersRef.current.delete(cid)
      }
    }

    // remove from remoteMedia
    setRemoteMedia(prev => {
      const toRemove = prev.find(m => m.producerId === producerId)
      if (toRemove && toRemove.stream) {
        toRemove.stream.getTracks().forEach(t => {
          try {
            t.stop()
          } catch (_) {}
        })
      }

      return prev.filter(m => m.producerId !== producerId)
    })

    setLoadingProducers(prev => {
      const copy = new Set(prev)
      copy.delete(producerId)

      return copy
    })
  }

  function resumeAllAudioContexts() {
    audioContextRef.current.forEach(ctx => {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
    })
  }

  function consumeProducer(producerId, ownerClientId, s = socket) {
    const device = deviceRef.current
    const recvTransport = recvTransportRef.current
    if (!device || !recvTransport || !s) return

    setLoadingProducers(prev => {
      const copy = new Set(prev)
      copy.add(producerId)

      return copy
    })

    s.emit(
      'consume',
      {
        roomId,
        transportId: recvTransport.id,
        producerId,
        rtpCapabilities: device.rtpCapabilities
      },
      async res => {
        if (!res || res.error) {
          // not allowed (e.g., attendee trying to consume non-broadcast producer)
          setLoadingProducers(prev => {
            const copy = new Set(prev)
            copy.delete(producerId)

            return copy
          })

          return
        }

        try {
          const consumer = await recvTransport.consume({
            id: res.id,
            producerId: res.producerId,
            kind: res.kind,
            rtpParameters: res.rtpParameters
          })

          consumer.appData = { producerId: res.producerId }
          consumersRef.current.set(consumer.id, consumer)

          const stream = new MediaStream()
          stream.addTrack(consumer.track)

          audioProducerOwnerRef.current.set(producerId, ownerClientId)

          if (res.kind === 'audio') {
            const audioEl = new Audio()
            audioEl.srcObject = stream
            audioEl.autoplay = true
            audioEl.playsInline = true
            audioEl.play().catch(() => {})

            // 🔊 ACTIVE SPEAKER ANALYSIS
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

            // 🔑 IMPORTANT: try to resume immediately
            if (audioCtx.state === 'suspended') {
              audioCtx.resume().catch(() => {})
            }

            audioContextRef.current.add(audioCtx)
            const source = audioCtx.createMediaStreamSource(stream)
            const analyser = audioCtx.createAnalyser()

            analyser.fftSize = 256
            const dataArray = new Uint8Array(analyser.frequencyBinCount)

            source.connect(analyser)

            audioAnalyserRef.current.set(producerId, { analyser, dataArray })

            setLoadingProducers(prev => {
              const copy = new Set(prev)
              copy.delete(producerId)

              return copy
            })

            return
          } else {
            // video: put in grid
            setRemoteMedia(prev => {
              const existing = prev.find(m => m.producerId === res.producerId)
              if (existing) {
                if (existing.stream) {
                  existing.stream.getTracks().forEach(t => {
                    try {
                      t.stop()
                    } catch (_) {}
                  })
                }

                return prev.map(m => (m.producerId === res.producerId ? { ...m, owner: ownerClientId, stream } : m))
              }

              return [...prev, { producerId: res.producerId, owner: ownerClientId, stream }]
            })

            setLoadingProducers(prev => {
              const copy = new Set(prev)
              copy.delete(producerId)

              return copy
            })

            toast.success('Receiving remote video')
          }
        } catch (err) {
          console.error('consume error', err)
          setLoadingProducers(prev => {
            const copy = new Set(prev)
            copy.delete(producerId)

            return copy
          })
        }
      }
    )
  }

  // ---------- host controls ----------
  function hostBroadcast(producerId) {
    if (!socket) return
    socket.emit('hostBroadcast', { roomId, producerId }, res => {
      if (res && res.error) return toast.error(res.error)
      toast.success('Broadcast started')
    })
  }

  function hostStopBroadcast(producerId) {
    if (!socket) return
    socket.emit('hostStopBroadcast', { roomId, producerId }, res => {
      if (res && res.error) return toast.error(res.error)
      toast.success('Broadcast stopped')
    })
  }

  // ---------- render ----------
  return (
    <>
      <Topbar />
      <Box className={'displayAreaBlock scrollDiv'} sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <h2>
            Meeting: {roomId}{' '}
            <span style={{ fontSize: 14, marginLeft: 8 }}>
              ({clientInfo.displayName} – {clientInfo.role})
            </span>
          </h2>
          <Button
            disabled={leavingRef.current}
            onClick={() => {
              if (leavingRef.current) return
              resumeAllAudioContexts()
              leavingRef.current = true

              socket?.emit('leave', { roomId }, () => {
                setTimeout(() => {
                  router.back()
                }, 200) // give server time to finish cleanup
              })

              dispatch(markUI({ isMeetingStarted: false }))
            }}
          >
            {leavingRef.current ? 'Leaving...' : 'Leave'}
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          {/* Local preview */}
          <div style={{ minWidth: 320 }}>
            <h4>Local</h4>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              width={320}
              height={240}
              style={{ border: '1px solid #ccc', borderRadius: 4 }}
            />
            <div style={{ marginTop: 8 }}>
              {!cameraOn ? (
                <Button onClick={startCamera} disabled={!sendTransportRef.current}>
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera}>Stop Camera</Button>
              )}
              <Button style={{ marginLeft: 8 }} onClick={toggleMic} disabled={!localStream}>
                {micMuted ? 'Unmute Mic' : 'Mute Mic'}
              </Button>
            </div>
          </div>

          {/* Remote grid */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <h4>Remote Screen</h4>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              {remoteMedia.map(m => (
                <div
                  key={m.producerId}
                  style={{
                    position: 'relative',
                    flex: '1 1 280px',
                    maxWidth: 'calc(33% - 12px)',
                    minWidth: 240,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: activeSpeakerClientId === m.owner ? '3px solid #00c853' : '1px solid #ccc',
                    boxShadow: activeSpeakerClientId === m.owner ? '0 0 12px rgba(0,200,83,0.7)' : 'none'
                  }}
                >
                  <video
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      borderRadius: 4,
                      border: '1px solid #ccc'
                    }}
                    ref={el => {
                      if (el && m.stream && el.srcObject !== m.stream) {
                        el.srcObject = m.stream
                      }
                    }}
                  />
                  {/* Owner label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 28,
                      left: 4,
                      padding: '2px 6px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      fontSize: 12,
                      borderRadius: 3
                    }}
                  >
                    {m.owner}
                  </div>
                  {/* Host broadcast controls at bottom of tile */}
                  {isHost && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {broadcastSet.has(m.producerId) ? (
                        <Button
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            marginTop: 2
                          }}
                          onClick={() => hostStopBroadcast(m.producerId)}
                        >
                          Stop Broadcast
                        </Button>
                      ) : (
                        <Button
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            marginTop: 2
                          }}
                          onClick={() => hostBroadcast(m.producerId)}
                        >
                          Broadcast
                        </Button>
                      )}
                    </div>
                  )}
                  {/* Loading overlay */}
                  {loadingProducers.has(m.producerId) && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 14
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side panel (peers + info only, no broadcast Buttons now) */}
          <div style={{ width: 260, minWidth: 220 }}>
            <h4>Peers</h4>
            <ul>
              {peers.map(p => (
                <li key={p.clientId}>
                  {p.displayName} ({p.role}){p.clientId === clientInfo.clientId ? ' — You' : ''}
                </li>
              ))}
            </ul>

            <h4 style={{ marginTop: 12 }}>Producers (info)</h4>
            <ul>
              {producers.map(p => (
                <li key={p.producerId} style={{ marginBottom: 4 }}>
                  Owner: {p.owner}
                  {isHost ? (
                    <span style={{ fontSize: 11, marginLeft: 4 }}>
                      [{broadcastSet.has(p.producerId) ? 'Broadcasting' : 'Not broadcasting'}]
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, marginLeft: 4 }}>[Auto-view]</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Box>
    </>
  )
}

export default Meeting
