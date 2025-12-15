// ** MUI Components
import { useState, useEffect, Fragment } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { withEnvPath } from 'utils/misc'

const slides = [
  {
    title1: 'Effortless corporate risk management',
    title2: 'powered by ',
    title3: `${process.env.NEXT_PUBLIC_COMPANY}!`,
    image: `${withEnvPath('/images/react-carousal-image-1.png')}`
  },
  {
    title1: 'Smart risk management for enterprises',
    title2: 'simplified by ',
    title3: `${process.env.NEXT_PUBLIC_COMPANY}!`,
    image: `${withEnvPath('/images/react-carousal-image-2.png')}`
  }
]

const ForgotPassword = () => {
  const theme = useTheme()
  const [current, setCurrent] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <Grid container height='100vh' overflow={{ xs: 'auto', md: 'hidden' }}>
      {/* Left Side Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black'
        }}
      >
        <Box
          component='img'
          src={withEnvPath('/images/LoginImage1.svg')}
          alt='background'
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6
          }}
        />

        {/* Carousel */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: 'fit-content', lg: 600 },
            height: 'auto',
            overflow: 'hidden',
            zIndex: 1,
            my: { xs: '20px', md: '0px' }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.7s ease-in-out',
              transform: `translateX(-${current * 100}%)`
            }}
          >
            {slides.map((item, i) => (
              <Box
                key={i}
                sx={{
                  width: '100%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Typography
                  as='span'
                  variant={'h3'}
                  sx={{
                    fontSize: { xs: '16px', lg: '20px' },
                    width: '100%',
                    marginBottom: '5px',
                    color: theme.palette.company.background,
                    textAlign: 'center',
                    fontWeight: 400
                  }}
                >
                  {item.title1}
                </Typography>
                <Typography
                  as='span'
                  variant={'h3'}
                  sx={{
                    fontSize: { xs: '16px', lg: '20px' },
                    width: '100%',
                    marginBottom: '10px',
                    color: theme.palette.company.background,
                    textAlign: 'center',
                    fontWeight: 400,
                    mb: '20px'
                  }}
                >
                  {item.title2}
                  <Typography
                    as='span'
                    variant={{ xs: 'h4', lg: 'h3' }}
                    sx={{ fontSize: { xs: '16px', lg: '20px' }, fontWeight: { xs: 500, lg: 600 } }}
                  >
                    {item.title3}
                  </Typography>
                </Typography>
                <Box component='img' src={item.image} sx={{ width: { xs: '300px', lg: 'auto' } }} />
              </Box>
            ))}
          </Box>

          {/* Dots */}
          <Box
            sx={{
              mt: '20px', // margin-top to push below the carousel
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}
          >
            {slides.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: current === i ? 'white' : 'grey.500',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
              />
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Right Side - Forgot Password Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          height: { xs: 'auto', md: '100%' },
          backgroundColor: theme.palette.company.background,
          alignContent: 'center',
          overflow: { xs: 'auto', md: 'hidden' },
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            px: 4,
            py: 8
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              gap: '10px',
              bottom: '30px',
              right: '30px'
            }}
          >
            <Typography variant='body2'>Powered by</Typography>
            <img alt='9USRcraftLogo' src={withEnvPath('/images/9USRcraftLogo.png')} />
          </Box>

          {/* Logo + Company Name */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              alt='logo'
              src={withEnvPath('/images/apple-touch-icon.png')}
              style={{ width: 120, height: 120, marginBottom: '10px' }} // ⬅️ Increased size
            />
            <Typography
              as='span'
              variant={'h3'}
              sx={{
                fontSize: { xs: '20px', lg: '24px' },
                width: '100%',
                marginBottom: '10px',
                textAlign: 'center',
                fontWeight: 400,
                mb: '10px'
              }}
            >
              Welcome to{' '}
              <Typography
                as='span'
                variant={'h2'}
                sx={{
                  fontSize: { xs: '20px', lg: '24px' },
                  width: '100%',
                  marginBottom: '10px',
                  textAlign: 'center',
                  mb: '10px'
                }}
              >{`${process.env.NEXT_PUBLIC_COMPANY}!`}</Typography>
            </Typography>
          </Box>

          {/* Title*/}
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
              Forgot Password?
            </Typography>
            <Typography variant='body2'>
              Enter your email and we'll send you instructions to reset your password.
            </Typography>
          </Box>

          {/* Form */}
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField autoFocus fullWidth type='email' label='Email' sx={{ display: 'flex', mb: 4 }} required />
            <Button variant={'secondary'} sx={{ width: '100%', height: '50px', mb: 5.25 }}>
              Send reset link
            </Button>

            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              <Link href='/login' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={withEnvPath('/images/icons/ArrowLeftIcon.svg')}
                  alt='arrow'
                  style={{ width: 14, height: 14 }}
                />
                <span style={{ marginLeft: 4 }}>Back to login</span>
              </Link>
            </Typography>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

// ✅ Correct layout wrapper return
ForgotPassword.getLayout = page => page

// ✅ Ensure guest-only access
ForgotPassword.guestGuard = true

export default ForgotPassword
