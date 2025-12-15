// ** Next Import
import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// ** MUI Components
import Typography from '@mui/material/Typography'
import { styled } from '@mui/styles'
import DisplayArea from 'components/layout/DisplayArea'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { withEnvPath } from 'utils/misc'
// ** Demo Imports

const Error404 = () => {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('userData'))
  useEffect(() => {
    if (user) {
      router.replace('/bhavik123') // logged-in users go here
    } else {
      router.replace('/login') // guests go here
    }
  }, [user, router])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <DisplayArea>
          <Typography variant='h1'>404</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Page Not Found ⚠️
          </Typography>
          <Typography variant='body2'>We couldn&prime;t find the page you are looking for.</Typography>
        </DisplayArea>
        <img height='487' alt='error-illustration' src={withEnvPath('/images/pages/404.png')} />
        <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}
Error404.getLayout = page => {
  page
}

export default Error404
