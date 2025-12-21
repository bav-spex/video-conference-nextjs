// src/pages/JoinMeeting.jsx
import { useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
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
  const [mediaType, setMediaType] = useState('audio-video')

  const handleChange = event => {
    setMediaType(event.target.value)
  }

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

      <Box
        className='displayAreaBlock scrollDiv'
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          pt: "200px",
          width: '100%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 4
          }}
        >
          {/* Heading */}
          <Box mb={3} textAlign='center'>
            <Typography variant='h6' fontWeight={600}>
              Join Meeting
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Enter room code and choose media type
            </Typography>
          </Box>

          {/* Room Code */}
          <TextField
            fullWidth
            label='Room Code'
            placeholder='Enter room code'
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Media Type */}
          <FormControl sx={{ mb: 3 }}>
            <FormLabel sx={{ mb: 1 }}>Media Type</FormLabel>
            <RadioGroup value={mediaType} onChange={handleChange}>
              <FormControlLabel value='video' control={<Radio />} label='🎥 Video Only' />
              <FormControlLabel value='audio' control={<Radio />} label='🎧 Audio Only' />
              <FormControlLabel value='audio-video' control={<Radio />} label='🎥 + 🎧 Audio & Video' />
            </RadioGroup>
          </FormControl>

          {/* Join Button */}
          <Button
            fullWidth
            size='large'
            variant='contained'
            onClick={joinRoom}
            disabled={!roomId}
            sx={{
              height: 48,
              fontWeight: 600
            }}
          >
            Join Room
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default JoinMeeting
