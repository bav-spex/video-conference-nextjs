// src/components/RemoteGrid.jsx
import React from 'react'

import { Button } from '@mui/material'

import Tile from './Tile'

const RemoteGrid = ({
  remoteMedia,
  peerNameMap,
  activeSpeakerClientId,
  loadingProducers,
  broadcastSet,
  hostBroadcast,
  hostStopBroadcast,
  isHost,
  remoteGridRef,
  toggleRemoteFullscreen,
  isRemoteFullscreen,
  getGridColumns,
  // new callbacks passed from Meeting
  onPromoteClick,
  onDemoteClick,
  onCapProducerClick
}) => {
  return (
    <div style={{ flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0 }}>{isHost ? 'Live Participants' : 'Presenter Stream'}</h4>

        {/* Fullscreen toggle for entire remote screen container */}
        <Button
          size='small'
          onClick={toggleRemoteFullscreen}
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            minWidth: 'auto',
            padding: '6px 8px',
            fontSize: 13
          }}
        >
          {isRemoteFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      <div
        ref={remoteGridRef}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${getGridColumns(remoteMedia.length || 1)}, 1fr)`,
          gap: 12,
          alignItems: 'stretch'
        }}
      >
        {remoteMedia.map(m => (
          <Tile
            key={m.producerId}
            m={m}
            peerNameMap={peerNameMap}
            activeSpeakerClientId={activeSpeakerClientId}
            loadingProducers={loadingProducers}
            broadcastSet={broadcastSet}
            hostBroadcast={hostBroadcast}
            hostStopBroadcast={hostStopBroadcast}
            isHost={isHost}
            onPromoteClick={onPromoteClick}
            onDemoteClick={onDemoteClick}
            onCapProducerClick={onCapProducerClick}
          />
        ))}
      </div>
    </div>
  )
}

export default RemoteGrid
