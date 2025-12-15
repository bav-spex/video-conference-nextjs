import React, { useState, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Checkbox, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { getVendorStatusDropdown } from 'services/common'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const VendorFrameworkForm = ({ formType, vendorFrameworkId, vendorFrameworkData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [vendor_assessment_status_dropdown, set_vendor_assessment_status_dropdown] = useState([])

  const [singleVendorFrameworkData, setSingleVendorFrameworkData] = useState(vendorFrameworkData)

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (vendorFrameworkData) {
      setSingleVendorFrameworkData(vendorFrameworkData)
    }
  }, [vendorFrameworkData])

  const validationSchema = yup.object().shape({
    name: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    status: yup.number().notOneOf([0], 'Status is required').required('status is required')
  })

  useEffect(() => {
    getVendorStatusDropdown(set_vendor_assessment_status_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (vendor_assessment_status_dropdown.length > 0) {
      setLoading(false)
    }
  }, [vendor_assessment_status_dropdown])

  // name
  // statusId
  const handleChange = (name, value) => {
    console.log(name, value)
    setSingleVendorFrameworkData({ ...singleVendorFrameworkData, [name]: value })
  }

  console.log('singleVendorFrameworkData===>', singleVendorFrameworkData)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit'
  })

  const handleFormSubmit = () => {
    const payload = {
      ...singleVendorFrameworkData
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    console.log('payload===>', payload)
    try {
      setSavingForm(true)
      let res
      if (vendorFrameworkId) {
        res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/frameworks/update/${vendorFrameworkId}`,
          'put',
          payload,
          {}
        )
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Edited successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/frameworks/save`,
          'post',
          payload,
          {}
        )
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push('/home/thirdparty/vendorFramework')
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

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('name')}
                    type='text'
                    label='Name *'
                    value={singleVendorFrameworkData.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.name?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('Status *')}</InputLabel>
                  <Select
                    {...register('status')}
                    value={singleVendorFrameworkData.status}
                    onChange={e => handleChange('status', e.target.value)}
                    label={t('Status *')}
                  >
                    {vendor_assessment_status_dropdown.map(c => (
                      <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.status?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h5'>{t('Is Active')}</Typography>
                  <Controller
                    name='active'
                    control={control}
                    defaultValue={!!singleVendorFrameworkData?.active}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={e => {
                          field.onChange(e.target.checked)
                          handleChange('active', e.target.checked) // keep your local state in sync
                        }}
                        disabled={formType === 'view'}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    variant='outlined'
                    onClick={() => router.push('/home/thirdparty/vendorFramework')}
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

export default VendorFrameworkForm
