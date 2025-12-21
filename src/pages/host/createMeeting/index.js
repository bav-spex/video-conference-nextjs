// src/pages/CreateMeeting.jsx
import React, { useState } from 'react'

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

const CreateMeeting = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [mediaType, setMediaType] = useState('audio-video')

  const handleChange = event => {
    setMediaType(event.target.value)
  }

  const createRoom = () => {
    const roomId = uuidv4().slice(0, 8)

    // Set host identity
    sessionStorage.setItem('role', 'host')
    sessionStorage.setItem('clientId', uuidv4())
    sessionStorage.setItem('displayName', 'Host-' + Math.random().toString(36).substring(2, 6))

    toast.success('Meeting created')
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
          pt: '200px',
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
              Create Meeting
            </Typography>
          </Box>

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
            onClick={createRoom}
            sx={{
              height: 48,
              fontWeight: 600
            }}
          >
            Create New Meeting as Host
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CreateMeeting
