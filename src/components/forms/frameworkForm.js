import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAllFrameworks } from 'services/governance/frameworks/FrameworkServices'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const FrameworkForm = ({ formType, frameworkId, frameworkData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [savingForm, setSavingForm] = useState(false)
  const [frameworks_dropdown, set_frameworks_dropdown] = useState([])
  const [singleFrameworkData, setSingleFrameworkData] = useState(frameworkData)

  useEffect(() => {
    if (frameworkData) {
      setSingleFrameworkData(frameworkData)
    }
  }, [frameworkData])

  useEffect(() => {
    getAllFrameworks(set_frameworks_dropdown)
  }, [])

  useEffect(() => {
    if (frameworks_dropdown.length > 0) {
      setLoading(false)
    }
  }, [frameworks_dropdown])

  const validationSchema = yup.object().shape({
    framework_Parent: yup.string().required('Parent framework is required'),
    framework_Name: yup.string().min(3, 'Must be at least 3 characters').required('This field is required'),
    framework_Details: yup.string().required('Description is required')
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit'
  })

  const handleChange = (name, value) => {
    setSingleFrameworkData({ ...singleFrameworkData, [name]: value })
  }

  const onSubmit = async data => {
    setSavingForm(true)

    const url =
      formType === 'edit'
        ? `${authConfig.governanceDevRakshitah_base_url}frameworks/update/${frameworkId}`
        : `${authConfig.governanceDevRakshitah_base_url}frameworks/new`

    const method = formType === 'edit' ? 'put' : 'post'

    const payload = formType === 'create' ? { ...data, framework_Status: 'active' } : data

    await apiHelper(url, method, payload, {})
      .then(res => {
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || formType === 'edit' ? 'Update successfully!' : 'Added successfully!',
          showConfirmButton: true
        })
        setSavingForm(false)
        router.push(`/home/governance/frameworks`)
      })
      .catch(err => {
        CommonSwal(theme, {
          icon: 'error',
          title: err?.response?.data || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        setSavingForm(false)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <Grid container spacing={{ xs: 4, md: 7.25 }}>
          {/* Framework Name */}
          <Grid item xs={12} sm={6} lg={4}>
            <FormControl fullWidth>
              <TextField
                {...register('framework_Name')}
                type='text'
                label='FrameWork Name *'
                value={singleFrameworkData.framework_Name}
                onChange={e => handleChange('framework_Name', e.target.value)}
                disabled={formType === 'view'}
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.framework_Name?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {/* // Parent Framework */}
          <Grid item xs={12} sm={6} lg={4}>
            <Controller
              name='framework_Parent'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='parent-framework-label'>Parent Framework *</InputLabel>
                  <Select
                    {...register('framework_Parent')}
                    labelId='parent-framework-label'
                    label='Parent Framework *'
                    disabled={formType === 'view'}
                    value={singleFrameworkData.framework_Parent}
                    onChange={e => handleChange('framework_Parent', e.target.value)}
                  >
                    {frameworks_dropdown.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.framework_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                    {errors.framework_Parent?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          {/* Enable Dashboard */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h5'>{t('Enable Dashboard')}</Typography>
              <Controller
                name='enableDashboard'
                control={control}
                defaultValue={singleFrameworkData?.enableDashboard || false}
                value={singleFrameworkData.enableDashboard}
                onChange={e => handleChange('enableDashboard', e.target.value)}
                render={({ field }) => <Checkbox {...field} checked={field.value} disabled={formType === 'view'} />}
              />
            </Box>
          </Grid>
          {/* Framework Description */}
          <Grid item xs={12} sm={12} lg={12}>
            <FormControl fullWidth>
              <TextField
                {...register('framework_Details')}
                type='text'
                label='Framework Description *'
                multiline
                minRows={3}
                maxRows={10}
                disabled={formType === 'view'}
                value={singleFrameworkData.framework_Details}
                onChange={e => handleChange('framework_Details', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                {errors.framework_Details?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button
                variant='outlined'
                onClick={() => router.push(`/home/governance/frameworks`)}
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
      )}
    </form>
  )
}

export default FrameworkForm
