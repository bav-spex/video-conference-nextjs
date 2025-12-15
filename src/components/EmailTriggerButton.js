import React from 'react'

import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'

const EmailTriggerButton = () => {
  const theme = useTheme()

  const openSwal = () => {
    CommonSwal(theme, {
      icon: 'success',
      title: 'Email sent successfully!',
      showConfirmButton: true
    })
  }

  return (
    <Button variant='primary' onClick={() => openSwal()}>
      Email
    </Button>
  )
}

export default EmailTriggerButton
