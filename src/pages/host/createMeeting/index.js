// src/pages/CreateMeeting.jsx
import React, { useState } from 'react'

import { Box, Button, TextField, Typography } from '@mui/material'
import Topbar from 'components/Topbar'
import { useAppDispatch } from 'hooks/hooks'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { markUI } from 'store/ui/uiSlice'
import { v4 as uuidv4 } from 'uuid'

const CreateMeeting = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [name, setName] = useState('')

  const createRoom = () => {
    if (!name.trim()) {
      toast.error('Please enter your name')

      return
    }

    const roomId = uuidv4().slice(0, 8)

    // Persist host identity
    sessionStorage.setItem('role', 'host')
    sessionStorage.setItem('clientId', uuidv4())
    sessionStorage.setItem('displayName', name.trim())

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
            <Typography variant='body2' color='text.secondary'>
              Enter your name to start the meeting
            </Typography>
          </Box>

          {/* Name */}
          <TextField
            fullWidth
            label='Your Name'
            placeholder='Enter your name'
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Create Button */}
          <Button
            fullWidth
            size='large'
            variant='contained'
            onClick={createRoom}
            disabled={!name}
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
