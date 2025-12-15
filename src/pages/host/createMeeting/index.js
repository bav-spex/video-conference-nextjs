// src/pages/CreateMeeting.jsx
import React from 'react'

import { Box, Button } from '@mui/material'
import Topbar from 'components/Topbar'
import { useAppDispatch } from 'hooks/hooks'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { markUI } from 'store/ui/uiSlice'
import { v4 as uuidv4 } from 'uuid'

const CreateMeeting = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

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
      <Box className={'displayAreaBlock scrollDiv'} sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
        <Button onClick={createRoom} style={{ padding: '10px 20px' }}>
          Create New Meeting as Host
        </Button>
      </Box>
    </>
  )
}

export default CreateMeeting
