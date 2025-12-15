import React, { useState, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { FormHelperText, ListItemText, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  getActionTypeDropdown,
  getEntityTypeDropdown,
  getNotificationFrequencyDropdown,
  getNotificationTypeDropdown,
  getTeamDropDown
} from 'services/common'
import apiHelper from 'store/apiHelper'
import { useAuth } from 'store/auth/AuthContext'
import * as yup from 'yup'

import FrequencyPopper from './FrequencyPopper'
import TeamPopper from './TeamPopper'

const NotificationRuleForm = ({ formType, ruleId, notificationrRuleData }) => {
  const { user } = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [savingForm, setSavingForm] = useState(false)
  const [type, setType] = useState('')
  const [actionType_dropdown, set_actionType_dropdown] = useState([])
  const [entityType_dropdown, set_entityType_dropdown] = useState([])
  const [notificationfType_dropdown, set_notificationfType_dropdown] = useState([])
  const [singleNotificationRuleData, setSingleNotificationRuleData] = useState(notificationrRuleData)

  const [team_dropdown, set_team_dropdown] = useState([])
  const [teamMappingName, setTeamMappingName] = useState([])
  const [teamDropdownIds, setTeamDropdownIds] = useState([])
  const [teamError, setTeamError] = useState()

  const [frequency_dropdown, set_frequency_dropdown] = useState([])
  const [frequencyMappingName, setFrequencyMappingName] = useState([])
  const [frequencyDropdownIds, setFrequencyDropdownIds] = useState([])
  const [frequencyError, setFrequencyError] = useState()

  const [teamAnchorEl, setTeamAnchorEl] = useState(null)
  const [openTeamPopper, setOpenTeamPopper] = useState(false)
  const [frequencyAnchorEl, setFrequencyAnchorEl] = useState(null)
  const [openFrequencyPopper, setOpenFrequencyPopper] = useState(false)

  useEffect(() => {
    if (notificationrRuleData) {
      setSingleNotificationRuleData(notificationrRuleData)
    }
  }, [notificationrRuleData])

  const validationSchema = yup.object().shape({
    entity: yup.string().required('Entity is required'),
    actionType: yup.string().required('Action Type is required'),
    type: yup.string().required('Type is required')
  })

  useEffect(() => {
    getNotificationFrequencyDropdown(set_frequency_dropdown)
    getTeamDropDown(set_team_dropdown)
    getActionTypeDropdown(set_actionType_dropdown)
    getEntityTypeDropdown(set_entityType_dropdown)
    getNotificationTypeDropdown(set_notificationfType_dropdown)
  }, [])

  useEffect(() => {
    if (
      frequency_dropdown.length > 0 &&
      team_dropdown.length > 0 &&
      actionType_dropdown.length > 0 &&
      entityType_dropdown.length > 0 &&
      notificationfType_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [frequency_dropdown, team_dropdown, actionType_dropdown, entityType_dropdown, notificationfType_dropdown])

  // Initially Update Team DropdownUI and TeamMappingName and TeamDropdownIds
  useEffect(() => {
    if (singleNotificationRuleData.team.length > 0 && team_dropdown.length > 0) {
      const initialTeamName = []

      singleNotificationRuleData.team.map(id => {
        team_dropdown.find(team => {
          if (team.id == id) {
            if (!initialTeamName.includes(team.teamName)) {
              initialTeamName.push(team.teamName)
            }
          }
        })
      })
      setTeamMappingName(initialTeamName)
    }
  }, [singleNotificationRuleData.team, team_dropdown])

  // Initially Update Team DropdownUI and TeamMappingName and TeamDropdownIds
  useEffect(() => {
    if (singleNotificationRuleData.frequency.length > 0 && frequency_dropdown.length > 0) {
      const initialFrequencyName = []

      singleNotificationRuleData.frequency.map(id => {
        frequency_dropdown.find(frequency => {
          if (frequency.id == id) {
            if (!initialFrequencyName.includes(frequency.lookupName)) {
              initialFrequencyName.push(frequency.lookupName)
            }
          }
        })
      })
      setFrequencyMappingName(initialFrequencyName)
    }
  }, [singleNotificationRuleData.frequency, frequency_dropdown])

  const handleChange = (name, value) => {
    setSingleNotificationRuleData({ ...singleNotificationRuleData, [name]: value })
  }

  // Team Change
  const handleTeamChange = value => {
    let arr = teamMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setTeamMappingName(arr)
  }
  useEffect(() => {
    if (singleNotificationRuleData) {
      let teamIds = []

      teamMappingName.map(name => {
        team_dropdown.find(team => {
          if (team.teamName === name) {
            if (!teamIds.includes(team.id)) {
              teamIds.push(Number(team.id))
            }
          }
        })
      })
      setTeamDropdownIds([...teamIds])
    }
  }, [teamMappingName])

  // Frequency Change
  const handleFrequencyChange = value => {
    let arr = frequencyMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setFrequencyMappingName(arr)
  }
  useEffect(() => {
    if (singleNotificationRuleData) {
      let frequencyIds = []

      frequencyMappingName.map(name => {
        frequency_dropdown.find(frequency => {
          if (frequency.lookupName === name) {
            if (!frequencyIds.includes(frequency.lookupId)) {
              frequencyIds.push(Number(frequency.lookupId))
            }
          }
        })
      })
      setFrequencyDropdownIds([...frequencyIds])
    }
  }, [frequencyMappingName])

  useEffect(() => {
    if (type === 'Event') {
      setFrequencyMappingName([])
      setFrequencyDropdownIds([])
      setFrequencyError()
    }
  }, [type])

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...singleNotificationRuleData
    }
  })

  const handleFormSubmit = () => {
    let hasError = false

    const isValidSelection = arr =>
      Array.isArray(arr) && arr.length > 0 && !arr.includes('0') && !arr.includes('') && !arr.includes('none')

    if (!isValidSelection(teamDropdownIds)) {
      setTeamError('Please select at least one')
      hasError = true
    } else {
      setTeamError('')
    }

    if (type === 'Schedule' && !isValidSelection(frequencyDropdownIds)) {
      setFrequencyError('Please select at least one')
      hasError = true
    } else {
      setFrequencyError('')
    }

    if (hasError) return

    const payload = {
      ...singleNotificationRuleData,
      team: teamDropdownIds,
      frequency: frequencyDropdownIds,
      userId: user.id,
      TemplateName: singleNotificationRuleData.templateName || '',
      lastRunTime: singleNotificationRuleData.lastRunTime ? singleNotificationRuleData.lastRunTime : null
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res

      if (ruleId) {
        res = await apiHelper(
          `${authConfig.authDevRakshitah_base_url}notificationConfig/updateConfig`,
          'put',
          payload,
          {}
        )
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Updated successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(
          `${authConfig.authDevRakshitah_base_url}notificationConfig/addConfig`,
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

      router.push(`/home/settings/notificationRules`)
    } catch (err) {
      console.error(err)

      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Something went wrong!'

      CommonSwal(theme, {
        icon: err?.response?.status === 409 ? 'warning' : 'error',
        title: errorMsg,
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
        <Box className='hide-scrollbar'>
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
            <Grid container spacing={7.5} marginTop={'5px'}>
              {' '}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                    Entity *
                  </InputLabel>
                  <Select
                    {...register('entity')}
                    fullWidth
                    label={'Entity *'}
                    value={singleNotificationRuleData.entity}
                    onChange={e => handleChange('entity', e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {entityType_dropdown.map(c => (
                      <MenuItem key={c.lookupName} value={c.lookupName}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.entity?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                    Action Type *
                  </InputLabel>
                  <Select
                    {...register('actionType')}
                    fullWidth
                    label={'Action Type *'}
                    value={singleNotificationRuleData.actionType}
                    onChange={e => handleChange('actionType', e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {actionType_dropdown.map(c => (
                      <MenuItem key={c.lookupName} value={c.lookupName}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.actionType?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                    Type *
                  </InputLabel>
                  <Select
                    {...register('type')}
                    fullWidth
                    label={'Type *'}
                    value={singleNotificationRuleData.type}
                    onChange={e => {
                      handleChange('type', e.target.value)
                      setType(e.target.value)
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
                    {notificationfType_dropdown.map(c => (
                      <MenuItem key={c.lookupName} value={c.lookupName}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.type?.message}</FormHelperText>
                </FormControl>
              </Grid>
              {type === 'Schedule' && (
                <Grid item xs={12} sm={6} lg={4}>
                  <Box sx={{ background: theme.palette.company.lighttertiary }}>
                    <Box
                      sx={{
                        height: '56px',
                        border: '1px solid',
                        background: openFrequencyPopper
                          ? theme.palette.company.primary
                          : theme.palette.company.background,
                        borderColor: theme.palette.company.primary,
                        color: openFrequencyPopper ? theme.palette.company.background : theme.palette.company.primary,
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={e => {
                        setFrequencyAnchorEl(openFrequencyPopper ? '' : e.currentTarget)
                        setOpenFrequencyPopper(openFrequencyPopper ? false : true)
                      }}
                    >
                      Select Frequency
                    </Box>
                    {frequencyMappingName.length > 0 && (
                      <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {frequencyMappingName.map(item => {
                          return (
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
                                  handleFrequencyChange(item)
                                }}
                              >
                                {' '}
                                <ClearRoundedIcon
                                  sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                                />{' '}
                              </Box>{' '}
                              <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                                {item}
                              </Typography>
                            </Box>
                          )
                        })}
                      </Box>
                    )}
                  </Box>
                  <FrequencyPopper
                    openFrequencyPopper={openFrequencyPopper}
                    setOpenFrequencyPopper={setOpenFrequencyPopper}
                    frequency_dropdown={frequency_dropdown}
                    frequencyMappingName={frequencyMappingName}
                    handleFrequencyChange={handleFrequencyChange}
                    frequencyAnchorEl={frequencyAnchorEl}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{frequencyError}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sm={6} lg={4}>
                <Box sx={{ background: theme.palette.company.lighttertiary }}>
                  <Box
                    sx={{
                      height: '56px',
                      border: '1px solid',
                      background: openTeamPopper ? theme.palette.company.primary : theme.palette.company.background,
                      borderColor: theme.palette.company.primary,
                      color: openTeamPopper ? theme.palette.company.background : theme.palette.company.primary,
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={e => {
                      setTeamAnchorEl(openTeamPopper ? '' : e.currentTarget)
                      setOpenTeamPopper(openTeamPopper ? false : true)
                    }}
                  >
                    Select Team
                  </Box>
                  {teamMappingName.length > 0 && (
                    <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {teamMappingName.map(item => {
                        return (
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
                                handleTeamChange(item)
                              }}
                            >
                              {' '}
                              <ClearRoundedIcon
                                sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                              />{' '}
                            </Box>{' '}
                            <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                              {item}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
                <TeamPopper
                  openTeamPopper={openTeamPopper}
                  setOpenTeamPopper={setOpenTeamPopper}
                  team_dropdown={team_dropdown}
                  teamMappingName={teamMappingName}
                  handleTeamChange={handleTeamChange}
                  teamAnchorEl={teamAnchorEl}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{teamError}</FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h5'>Enable</Typography>
                  <Controller
                    name='enable'
                    control={control}
                    defaultValue={singleNotificationRuleData?.enable || false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={!!field.value}
                        onChange={e => {
                          field.onChange(e.target.checked)
                          handleChange('enable', e.target.checked)
                        }}
                        disabled={formType === 'view'}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    variant='outlined'
                    onClick={() => router.push(`/home/settings/notificationRules`)}
                    sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='secondary'
                    sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                  >
                    {savingForm ? (
                      <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </form>
    </>
  )
}

export default NotificationRuleForm
