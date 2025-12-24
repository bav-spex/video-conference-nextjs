import { useState, useEffect, Fragment } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, FormControlLabel, Grid } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import authConfig from 'configs/auth'
import azureConfig from 'configs/azureConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'store/auth/AuthContext'
import { withEnvPath } from 'utils/misc'
import * as yup from 'yup'

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(5).required('Password is required')
})

const defaultValues = {
  password: '',
  username: ''
}

const TempToken = 'your-static-token-here'

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

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const auth = useAuth()
  const theme = useTheme()

  const [current, setCurrent] = useState(0)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    setSubmitting(true)

    // const authParams = {
    //   username: data.username,
    //   password: data.password,
    //   rememberMe
    // }

    localStorage.setItem('login', JSON.stringify('true'))
    router.push('/dashboard')

    // auth.login(authParams, ({ field, message }) => {
    //   setSubmitting(false)
    //   setLoginError('Invalid Credentials, Try again')
    // })
  }

  const login = JSON.parse(localStorage.getItem('login'))


  useEffect(() => {
    if (login && login === 'true') {
      router.push('/dashboard')
    }
  }, [login])

  const handleLoginViaAzureAD = async e => {
    e.preventDefault()

    const client = new Msal.UserAgentApplication(azureConfig)
    const request = { scopes: ['user.read'] }

    const loginResponse = await client.loginPopup(request)
    const tokenResponse = await client.acquireTokenSilent(request)

    if (tokenResponse) {
      await axios
        .get(`${authConfig.authDevRakshitah_base_url}authenticate/me`, {
          headers: { Authorization: `Bearer ${TempToken}` }
        })
        .then(response => {
          response.data['role'] = response.data['role'].trim()
          localStorage.setItem('userData', JSON.stringify(response.data))
          localStorage.setItem(authConfig.storageTokenKeyName, TempToken)
          router.push('/users/roles')
        })
        .catch(err => {
          console.log(err)
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.push('/login')
            // router.push('/dashboard')
          }
        })
    }
  }

  return (
    <>
      <Grid container height={'100vh'} overflow={{ xs: 'auto', md: 'hidden' }}>
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
          {/* Background Image */}
          <Box
            component='img'
            src={withEnvPath(`/images/LoginImage1.svg`)}
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
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: { xs: 'auto', md: '100%' },
            backgroundColor: theme.palette.company.background,
            alignContent: 'center',
            overflow: { xs: 'auto', md: 'hidden' },
            position: 'relative'
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: { xs: '300px', sm: '400px' },
              mx: 'auto',
              mt: { xs: '20px', md: '0px' },
              mb: { xs: '100px', md: '0px' }
            }}
          >
            <Box
              component={'img'}
              sx={{ width: { xs: '80px', md: '120px' }, marginBottom: '10px' }}
              alt='tree'
              src={withEnvPath('/images/logo.png')}
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

            <Typography variant='body2' sx={{ marginBottom: '30px' }}>
              Sign-in to your account
            </Typography>

            {loginError && (
              <Alert severity='error' sx={{ mb: '20px', width: '100%' }}>
                {loginError}
              </Alert>
            )}

            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: '30px' }} required>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Username'
                      value={value}
                      onBlur={onBlur}
                      onFocus={() => setLoginError('')}
                      onChange={e => {
                        setLoginError('')
                        onChange(e)
                      }}
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: '10px' }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onFocus={() => setLoginError('')}
                      onChange={e => {
                        setLoginError('')
                        onChange(e)
                      }}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <img
                              src={showPassword ? '/images/icons/EyeOnIcon.svg' : '/images/icons/EyeOffIcon.svg'}
                              alt={showPassword ? 'Show password' : 'Hide password'}
                              width={30}
                              height={30}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>

              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  name='rememberMe'
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Link
                  style={{ textDecoration: 'none', fontSize: '14px', color: theme.palette.company.lightprimary }}
                  href='/forgot-password'
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button variant={'secondary'} sx={{ width: '100%', height: '50px' }} type='submit'>
                {submitting ? <CircularProgress sx={{ color: '#ffffff' }} size='20px' /> : 'Login'}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

LoginPage.getLayout = page => page
LoginPage.guestGuard = true

export default LoginPage
