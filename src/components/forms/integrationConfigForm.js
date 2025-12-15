import React, { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  CircularProgress,
  Checkbox,
  FormHelperText,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const IntegrationConfigForm = ({ formType, integrationId, configId, configData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)

  const [singleConfigData, setConfigData] = useState({
    ...configData
  })
  const [savingForm, setSavingForm] = useState(false)

  const validationSchema = yup.object().shape({
    apiUrl: yup.string().min(3, 'Must be at least 3 characters').required('This field is required'),
    clientId: yup.string().min(3, 'Must be at least 3 characters').required('This field is required'),
    clientSecret: yup.string().min(3, 'Must be at least 3 characters').required('This field is required')
  })

  const handleChange = (name, value) => {
    setConfigData(prev => ({ ...prev, [name]: value }))
  }

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm({ resolver: yupResolver(validationSchema), mode: 'onSubmit' })

  const handleFormSubmit = async () => {
    const payload = {
      apiUrl: singleConfigData.apiUrl,
      clientId: singleConfigData.clientId,
      clientSecret: singleConfigData.clientSecret,
      integrationId: integrationId * 1,
      ...(configId ? { id: configId * 1 } : {})
    }

    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = await apiHelper(`${authConfig.authDevRakshitah_base_url}integration/updateConfig`, 'put', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Update successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(`${authConfig.authDevRakshitah_base_url}integration/addConfig`, 'post', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.back()
    } catch (err) {
      console.error(err)
      CommonSwal(theme, {
        icon: 'error',
        title: err?.response?.data || 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setSavingForm(false)
    }
  }

  console.log('singleConfigData====>', singleConfigData)

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {singleConfigData?.name && (
          <Typography variant='h4' sx={{ marginBottom: { xs: '16px', md: '20px' } }}>
            {singleConfigData?.name}
          </Typography>
        )}
        {loading ? (
          <Box
            sx={{
              height: '50vh',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <CircularProgress disableShrink sx={{ mt: 6, color: theme.palette.company.primary }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 4, md: 7.25 }}>
              {' '}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('apiUrl')}
                    type='text'
                    label='API URL *'
                    value={singleConfigData.apiUrl}
                    onChange={e => handleChange('apiUrl', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.apiUrl?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('clientId')}
                    type='text'
                    label='Client ID *'
                    value={singleConfigData.clientId}
                    onChange={e => handleChange('clientId', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.clientId?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('clientSecret')}
                    type='text'
                    label='Client Secret *'
                    value={singleConfigData.clientSecret}
                    onChange={e => handleChange('clientSecret', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                    {errors?.clientSecret?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    variant='outlined'
                    onClick={() => router.back()}
                    sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    type='submit'
                    variant='secondary'
                    sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                  >
                    {savingForm ? (
                      <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
                    ) : (
                      t('Save')
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </form>
    </>
  )
}

export default IntegrationConfigForm
