import React, { useEffect, useState, useRef } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
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
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CommonSwal } from 'components/CommonSwal'
import FrameworkPopper from 'components/forms/control/FrameworkPopper'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getFrequencyDropdown,
  getAdditionlStakeHoldersDropDown,
  getControlTypeDropDown,
  getControlStatusDropDown,
  getFrameworkDropDown,
  getControlDropDown
} from 'services/common'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const ControlForm = ({ formType, controlData, controlId }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [controltype_dropdown, set_controltype_dropdown] = useState([])
  const [controlstatus_dropdown, set_controlstatus_dropdown] = useState([])
  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])
  const [controlFrequency_dropdown, set_controlFrequency_dropdown] = useState([])

  const [framework_dropdown, set_framework_dropdown] = useState([])
  const [frameworkMappingName, setFrameworkMappingName] = useState([])
  const [frameworkDropdownIds, setFrameworkDropdownIds] = useState([])
  const [frameworkError, setFrameworkError] = useState()

  const [singleControlData, setSingleControlData] = useState(controlData)
  const existingControlRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const [savingForm, setSavingForm] = useState(false)
  const [openFrameworkPopper, setOpenFrameworkPopper] = useState(false)
  const [frameworkAnchorEl, setFrameworkAnchorEl] = useState(null)

  useEffect(() => {
    if (controlData) {
      setSingleControlData(controlData)
    }
  }, [controlData])

  const validationSchema = yup.object().shape({
    shortname: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    long_name: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    desc: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    supplementalguidance: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    number: yup.string().min(1, 'Existing control is required').required('This field is required'),
    controltype: yup.number().notOneOf([0], 'Control Type is required').required('controlType is required'),
    status: yup.number().notOneOf([0], 'Status is required').required('status is required'),
    owner: yup.number().notOneOf([0], 'Owner is required').required('Owner is required'),
    desired_frequency: yup.number().notOneOf([0], 'Frequency is required').required('Frequency is required')
  })

  const [existingControls, setExistingControls] = useState([])

  useEffect(() => {
    getControlTypeDropDown(set_controltype_dropdown)
    getControlStatusDropDown(set_controlstatus_dropdown)
    getFrameworkDropDown(set_framework_dropdown)
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown)
    getControlDropDown(setExistingControls)
    getFrequencyDropdown(set_controlFrequency_dropdown)
  }, [])

  useEffect(() => {
    if (
      controltype_dropdown.length > 0 &&
      controlstatus_dropdown.length > 0 &&
      additionalstakeholders_dropdown.length > 0 &&
      existingControls.length > 0 &&
      controlFrequency_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [
    controltype_dropdown,
    controlstatus_dropdown,
    additionalstakeholders_dropdown,
    existingControls,
    controlFrequency_dropdown
  ])

  // Initially Update Framework DropdownUI and FrameworkMappingName and FrameworkDropdownIds
  useEffect(() => {
    if (singleControlData.frameworkids.length > 0 && framework_dropdown.length > 0) {
      const initialFrameworkName = []
      singleControlData.frameworkids.map(id => {
        framework_dropdown.map(framework => {
          if (framework.id === id) {
            if (!initialFrameworkName.includes(framework.framework_Name)) {
              initialFrameworkName.push(framework.framework_Name)
            }
          }
        })
      })
      setFrameworkMappingName(initialFrameworkName)
    }
  }, [singleControlData.frameworkids, framework_dropdown])

  // Control Short Name
  // Control Long Name
  // Control Description
  // Supplemental Guidence
  // Existing Controls
  // Control Type
  // Control Status
  // Control Owner
  // Control Framework
  const handleChange = (name, value) => {
    setSingleControlData({ ...singleControlData, [name]: value })
  }

  const handleFrameworkChange = frameworkName => {
    let updatedList = []

    if (frameworkMappingName.includes(frameworkName)) {
      updatedList = frameworkMappingName.filter(name => name !== frameworkName)
    } else {
      updatedList = [...frameworkMappingName, frameworkName]
    }

    setFrameworkMappingName(updatedList)
  }

  useEffect(() => {
    if (singleControlData) {
      let frameworkIds = []
      frameworkMappingName.map(name => {
        framework_dropdown.find(framework => {
          if (framework.framework_Name === name) {
            if (!frameworkIds.includes(framework.id)) {
              frameworkIds.push(Number(framework.id))
            }
          }
        })
      })
      setFrameworkDropdownIds([...frameworkIds])
    }
  }, [frameworkMappingName])

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

  useEffect(() => {
    if (existingControlRef.current) {
      const isOverflowing = existingControlRef.current.scrollWidth > existingControlRef.current.clientWidth
      setShowTooltip(isOverflowing)
    }
  }, [singleControlData.number, existingControls])

  const handleFormSubmit = e => {
    if (!frameworkDropdownIds || frameworkDropdownIds.length === 0 || frameworkDropdownIds.includes(0)) {
      // Show error manually
      setFrameworkError('Please select at least one')
    } else {
      const payload = {
        ...singleControlData,
        frameworkids: frameworkDropdownIds,
        submission_date: new Date().toISOString(),
        last_audit_date: new Date().toISOString(),
        next_audit_date: new Date().toISOString(),
        desired_frequency: singleControlData.desired_frequency,
        mitigation_percent: 0,
        deleted: 0
      }
      onSubmit(payload)
    }
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = await apiHelper(
          `${authConfig.governanceDevRakshitah_base_url}controls/update/${controlId}`,
          'put',
          payload,
          {}
        )
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Update successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(`${authConfig.governanceDevRakshitah_base_url}controls/new`, 'post', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push(`/home/governance/controls`)
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
        {' '}
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
            {/* Control Short Name */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth required>
                <TextField
                  {...register('shortname')}
                  id='outlined-shortname'
                  label={t('Control Short Name *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleControlData.shortname}
                  onChange={e => handleChange('shortname', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.shortname?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Long Name */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('long_name')}
                  id='outlined-long-name'
                  label={t('Control Long Name *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleControlData.long_name}
                  onChange={e => handleChange('long_name', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.long_name?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Description */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('desc')}
                  id='outlined-desc'
                  label={t('Control Description *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleControlData.desc}
                  onChange={e => handleChange('desc', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.desc?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Number */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('number')}
                  id='outlined-controlnumber'
                  label={t('Control Number *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleControlData.number}
                  onChange={e => handleChange('number', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.number?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Supplemental Guidance */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('supplementalguidance')}
                  id='outlined-supplementalguidance'
                  label={t('Supplemental Guidance *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleControlData.supplementalguidance}
                  onChange={e => handleChange('supplementalguidance', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.supplementalguidance?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Existing Controls */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='existing-controls-label'>{t('Existing Controls *')}</InputLabel>
                <Tooltip
                  title={
                    showTooltip
                      ? existingControls.find(item => item['control-number'] === singleControlData.number)
                          ?.description || ''
                      : ''
                  }
                  placement='top'
                  arrow
                >
                  <Select
                    {...register('number')}
                    labelId='existing-controls-label'
                    id='existing-controls'
                    value={singleControlData.number}
                    onChange={e => handleChange('number', e.target.value)}
                    label={t('Existing Controls *')}
                    renderValue={selected => {
                      const selectedItem = existingControls.find(item => item['control-number'] === selected)

                      return (
                        <div
                          ref={existingControlRef}
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {selectedItem?.description || ''}
                        </div>
                      )
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {existingControls.length > 0 ? (
                      existingControls.map(item => (
                        <MenuItem key={item.id} value={item['control-number']}>
                          {item.description}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No existing controls available</MenuItem>
                    )}
                  </Select>
                </Tooltip>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.number?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Type */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='control-type-label'>{t('Control Type *')}</InputLabel>
                <Select
                  {...register('controltype')}
                  labelId='control-type-label'
                  id='control-type'
                  value={singleControlData.controltype}
                  label={t('Control Type *')}
                  onChange={e => handleChange('controltype', e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150
                      }
                    }
                  }}
                >
                  {controltype_dropdown.map(item =>
                    item !== null ? (
                      <MenuItem key={item.lookupId} value={item.lookupId}>
                        {item.lookupName}
                      </MenuItem>
                    ) : (
                      ''
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.controltype?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Status */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='control-status-label'>{t('Control Status *')}</InputLabel>
                <Select
                  {...register('status')}
                  labelId='control-status-label'
                  id='control-status'
                  value={singleControlData.status}
                  label={t('Control Status *')}
                  onChange={e => handleChange('status', e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150
                      }
                    }
                  }}
                >
                  {controlstatus_dropdown.map(item =>
                    item !== null ? (
                      <MenuItem key={item.lookupId} value={item.lookupId}>
                        {item.lookupName}
                      </MenuItem>
                    ) : (
                      ''
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.status?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Owner */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='control-owner-label'>{t('Control Owner *')}</InputLabel>
                <Select
                  {...register('owner')}
                  labelId='control-owner-label'
                  id='control-owner'
                  value={singleControlData.owner}
                  label={t('Control Owner *')}
                  onChange={e => handleChange('owner', e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150
                      }
                    }
                  }}
                >
                  {additionalstakeholders_dropdown.map(item =>
                    item !== null ? (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullName}
                      </MenuItem>
                    ) : (
                      ''
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.owner?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Frameworks */}
            <Grid item xs={12} sm={6} lg={4}>
              <Box sx={{ background: theme.palette.company.lighttertiary }}>
                <Box
                  sx={{
                    height: '56px',
                    border: '1px solid',
                    background: openFrameworkPopper ? theme.palette.company.primary : theme.palette.company.background,
                    borderColor: theme.palette.company.primary,
                    color: openFrameworkPopper ? theme.palette.company.background : theme.palette.company.primary,
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    setFrameworkAnchorEl(openFrameworkPopper ? '' : e.currentTarget)
                    setOpenFrameworkPopper(prev => !prev)
                  }}
                >
                  {t('Select Framework')}
                </Box>

                {frameworkMappingName.length > 0 && (
                  <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {frameworkMappingName.map(item => (
                      <Box
                        key={item}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `${theme.palette.company.primary}20`,
                          padding: '5px 10px 5px 5px',
                          borderRadius: '20px',
                          gap: '8px'
                        }}
                      >
                        <Box
                          sx={{
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px',
                            background: theme.palette.company.background,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            const updated = frameworkMappingName.filter(name => name !== item)
                            setFrameworkMappingName(updated)
                          }}
                        >
                          <ClearRoundedIcon
                            sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                          />
                        </Box>
                        <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <FrameworkPopper
                openFrameworkPopper={openFrameworkPopper}
                setOpenFrameworkPopper={setOpenFrameworkPopper}
                framework_dropdown={framework_dropdown}
                frameworkMappingName={frameworkMappingName}
                handleFrameworkChange={handleFrameworkChange}
                frameworkAnchorEl={frameworkAnchorEl}
              />

              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{frameworkError}</FormHelperText>
            </Grid>

            {/* Control Frequency */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='desired-frequency-label'>{t('Control Frequency *')}</InputLabel>
                <Select
                  {...register('desired_frequency')}
                  labelId='desired-frequency-label'
                  id='desired-frequency'
                  value={singleControlData.desired_frequency}
                  label={t('desired Frequency *')}
                  onChange={e => handleChange('desired_frequency', e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150
                      }
                    }
                  }}
                >
                  {controlFrequency_dropdown.map(item =>
                    item !== null ? (
                      <MenuItem key={item.lookupId} value={item.lookupId}>
                        {item.lookupName}
                      </MenuItem>
                    ) : (
                      ''
                    )
                  )}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.desired_frequency?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Final Button Actions (Aligned Like RiskForm) */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  variant='outlined'
                  onClick={() => router.push(`/home/governance/controls`)}
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
    </>
  )
}

export default ControlForm
