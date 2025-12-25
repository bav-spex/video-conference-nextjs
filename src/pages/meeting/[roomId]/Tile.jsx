// src/components/Tile.jsx
import React from 'react'

import { Button } from '@mui/material'

const Tile = ({ m, peerNameMap, activeSpeakerClientId, loadingProducers, broadcastSet, hostBroadcast, hostStopBroadcast, isHost }) => {
  const isActive = activeSpeakerClientId === m.owner

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: isActive ? '3px solid #00c853' : '1px solid #ccc',
        boxShadow: isActive ? '0 0 12px rgba(0,200,83,0.7)' : 'none',
        aspectRatio: '16/9',
        width: '100%',
        background: '#000'
      }}
    >
      <video
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
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
          left: 8,
          padding: '4px 8px',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          fontSize: 12,
          borderRadius: 4
        }}
      >
        {peerNameMap.current.get(m.owner) || 'Guest'}
      </div>

      {/* Host broadcast controls */}
      {isHost && (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            zIndex: 5
          }}
        >
          {broadcastSet.has(m.producerId) ? (
            <Button style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => hostStopBroadcast(m.producerId)}>
              Stop Broadcast
            </Button>
          ) : (
            <Button style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => hostBroadcast(m.producerId)}>
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
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            zIndex: 4
          }}
        >
          Loading...
        </div>
      )}
    </div>
  )
}

export default Tile
