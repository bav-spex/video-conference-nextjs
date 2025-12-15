// src/pages/JoinMeeting.jsx
import { useState } from 'react'

import { Box, Button } from '@mui/material'
import Topbar from 'components/Topbar'
import { useAppDispatch } from 'hooks/hooks'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { markUI } from 'store/ui/uiSlice'
import { v4 as uuidv4 } from 'uuid'

const JoinMeeting = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [roomId, setRoomId] = useState('')

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter room code')

      return
    }

    // Configure attendee identity
    sessionStorage.setItem('role', 'attendee')
    sessionStorage.setItem('clientId', uuidv4())
    sessionStorage.setItem('displayName', 'User-' + Math.random().toString(36).substring(2, 6))

    toast.success('Joining meeting...')
    dispatch(markUI({ isMeetingStarted: true }))
    router.push(`/meeting/${roomId}`)
  }

  return (
    <>
      <Topbar />
      <Box className={'displayAreaBlock scrollDiv'} sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
        <input
          placeholder='Enter room code'
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          style={{ padding: 10, width: 250, marginRight: 10 }}
        />

        <Button onClick={joinRoom} style={{ padding: '10px 20px' }}>
          Join
        </Button>
      </Box>
    </>
  )
}

export default JoinMeeting
