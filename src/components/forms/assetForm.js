import React, { useState, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
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
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAdditionlStakeHoldersDropDown, getAssetTypeDropdown, getSiteLocationDropDown } from 'services/common'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const AssetForm = ({ formType, assetId, assetData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [assetTypeDropdown, setAssetTypeDropdown] = useState([])
  const [ownerDropdown, setOwnerDropdown] = useState([])
  const [locationDropdown, setLocationDropdown] = useState([])

  const [singleAssetData, setSingleAssetData] = useState(assetData)

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (assetData) {
      setSingleAssetData(assetData)
    }
  }, [assetData])

  const validationSchema = yup.object().shape({
    assetName: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    assetType: yup.number().notOneOf([0], 'Asset Type is required').required('Asset Type is required'),
    description: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    owner: yup.number().notOneOf([0], 'Owner is required').required('Owner is required'),
    location: yup.number().notOneOf([0], 'Location is required').required('Location is required')
  })

  useEffect(() => {
    getAssetTypeDropdown(setAssetTypeDropdown, () => {})
    getAdditionlStakeHoldersDropDown(setOwnerDropdown, () => {})
    getSiteLocationDropDown(setLocationDropdown, () => {})
  }, [])

  useEffect(() => {
    if (assetTypeDropdown.length > 0 && ownerDropdown.length > 0 && locationDropdown.length > 0) {
      setLoading(false)
    }
  }, [assetTypeDropdown, ownerDropdown, locationDropdown])

  // auditName
  // categoryId
  // frameworkId
  // ownerId
  // statusId
  const handleChange = (name, value) => {
    setSingleAssetData({ ...singleAssetData, [name]: value })
  }

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
      ...singleAssetData
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/update`, 'put', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Edited successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/new`, 'post', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push(`/home/riskManagement/assets`)
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
                    {...register('assetName')}
                    id='outlined-assetName'
                    type='text'
                    label='Asset Name *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleAssetData.assetName}
                    onChange={e => handleChange('assetName', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.assetName?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Asset Type *')}
                  </InputLabel>
                  <Select
                    {...register('assetType')}
                    labelId='validation-basic-select'
                    id='assetType'
                    value={singleAssetData.assetType}
                    onChange={e => handleChange('assetType', e.target.value)}
                    label={t('Asset Type *')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {assetTypeDropdown.map(c => (
                      <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.assetType?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth required>
                  <TextField
                    {...register('description')}
                    id='outlined-description'
                    type='text'
                    label='Description *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleAssetData.description}
                    onChange={e => handleChange('description', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.description?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Owner *')}
                  </InputLabel>
                  <Select
                    {...register('owner')}
                    labelId='validation-basic-select'
                    id='owner'
                    value={singleAssetData.owner}
                    onChange={e => handleChange('owner', e.target.value)}
                    label={t('Owner *')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {ownerDropdown.map(c => (
                      <MenuItem key={c.id} value={Number(c.id)}>
                        {c.userName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.owner?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Location *')}
                  </InputLabel>
                  <Select
                    {...register('location')}
                    labelId='validation-basic-select'
                    id='location'
                    value={singleAssetData.location}
                    onChange={e => handleChange('location', e.target.value)}
                    label={t('Location *')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {locationDropdown.map(c => (
                      <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.location?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    variant='outlined'
                    onClick={() => router.push(`/home/riskManagement/assets`)}
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

export default AssetForm
