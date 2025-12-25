// src/components/LocalPanel.jsx
import React from 'react'

import { Box, Button } from '@mui/material'

const LocalPanel = ({
  localVideoRef,
  cameraOn,
  startCamera,
  stopCamera,
  toggleMic,
  micMuted,
  localStream,
  peers,
  producers,
  clientInfo,
  broadcastSet,
  isHost
}) => {
  return (
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
          <Button onClick={startCamera} disabled={false}>
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopCamera}>Stop Camera</Button>
        )}
        <Button style={{ marginLeft: 8 }} onClick={toggleMic} disabled={!localStream}>
          {micMuted ? 'Unmute Mic' : 'Mute Mic'}
        </Button>
      </div>

      <Box sx={{ width: 260, minWidth: 220, mt: '50px' }}>
        <h4>Peers</h4>
        <ul>
          {peers.map(p => (
            <li key={p.clientId}>
              {p.displayName} ({p.role}){p.clientId === clientInfo.clientId ? ' — You' : ''}
            </li>
          ))}
        </ul>

        {/* keep original debug logging behavior */}
        {producers.map(p => {
          {
            isHost
              ? console.log(
                  `Owner: ${p.owner} - [${broadcastSet.has(p.producerId) ? 'Broadcasting' : 'Not broadcasting'}]`
                )
              : console.log(`Owner: ${p.owner} - [Auto-view]`)
          }

          return null
        })}
      </Box>
    </div>
  )
}

export default LocalPanel
