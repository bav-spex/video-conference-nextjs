import { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { CircularProgress, DialogActions } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import { Controller, useForm } from 'react-hook-form'
import apiHelper from 'store/apiHelper'
import { useAuth } from 'store/auth/AuthContext'
import Swal from 'sweetalert2'
import { withEnvPath } from 'utils/misc'
import * as yup from 'yup'

const SecurityTab = () => {
  const theme = useTheme()
  const [twoFactorModal, setTwoFactorModal] = useState(false)
  const [savingForm, setSavingForm] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorAuthenticationError, setTwoFactorAuthenticationError] = useState('')

  const twoFactordefaultValues = {
    username: '',
    password: ''
  }

  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(5).required()
  })

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    twoFactordefaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    setSavingForm(true)

    const authParams = {
      username: data.username,
      password: data.password
    }

    apiHelper(`${authConfig.authDevRakshitah_base_url}authenticate/validateSmtp`, 'post', authParams, {})
      .then(res => {
        setSavingForm(false)
        handleTwoFactorClose()
        Swal.fire({
          icon: 'success',
          title: res?.data?.message,
          showConfirmButton: true
        })
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.message || 'Update successfully!',
          showConfirmButton: true
        })
      })
      .catch(err => {
        console.log(err)
        setSavingForm(false)
        setTwoFactorAuthenticationError(err?.response?.data?.message || 'Something went wrong!')
      })
  }

  return (
    <>
      <Box
        sx={{
          background: theme.palette.company.background,
          border: '1px solid',
          borderColor: theme.palette.company.lightgrey,
          padding: '20px 20px',
          m: '30px 30px',
          borderRadius: '5px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='h5'>Two-step verification</Typography>
            <Typography variant='body1'>Keep your account secure with authentication step.</Typography>
          </Box>
          <IconButton sx={{ color: 'blue' }} onClick={() => setTwoFactorModal(true)}>
            <img src={withEnvPath('/images/icons/GreyEditIcon.svg')} alt='Edit Document' />
          </IconButton>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth='sm' open={twoFactorModal} onClose={() => setTwoFactorModal(false)}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
            <Typography variant='h4'>Two Factor Authentication</Typography>
          </DialogTitle>

          <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
            <Typography variant='body2' sx={{ mb: '20px' }}>
              Enter your username with password and we will send you a verification code.
            </Typography>

            {twoFactorAuthenticationError && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {twoFactorAuthenticationError}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 4 }} required>
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
                    onFocus={() => setTwoFactorAuthenticationError('')}
                    onChange={e => {
                      setTwoFactorAuthenticationError('')
                      onChange(e)
                    }}
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
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
                    onFocus={() => setTwoFactorAuthenticationError('')}
                    onChange={e => {
                      setTwoFactorAuthenticationError('')
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
                          {showPassword ? (
                            <RemoveRedEyeRoundedIcon sx={{ color: theme.palette.company.grey }} />
                          ) : (
                            <VisibilityOffRoundedIcon sx={{ color: theme.palette.company.grey }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: { xs: '10px', sm: '20px' } }}>
            <Button
              onClick={() => setTwoFactorModal(false)}
              variant='outlined'
              sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='secondary'
              sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            >
              {savingForm ? <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default SecurityTab
