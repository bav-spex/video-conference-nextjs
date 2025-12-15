import { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { FormHelperText, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { CommonSwal } from 'components/CommonSwal'
import CustomAvatar from 'components/mui/avatar'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAdditionlStakeHoldersDropDown, getAllRoles, getTeamDropDown } from 'services/common'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'
import { getInitials } from 'utils/get-initials'
import * as yup from 'yup'

import RolePopper from './RolePopper'
import TeamPopper from './TeamPopper'

const UserForm = ({ formType, userId, userData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()

  const [role_dropdown, set_role_dropdown] = useState([])
  const [roleMappingName, setRoleMappingName] = useState([])
  const [roleDropdownIds, setRoleDropdownIds] = useState([])
  const [roleError, setRoleError] = useState()

  const [roleAnchorEl, setRoleAnchorEl] = useState(null)
  const [openRolePopper, setOpenRolePopper] = useState(false)

  const [team_dropdown, set_team_dropdown] = useState([])
  const [teamMappingName, setTeamMappingName] = useState([])
  const [teamDropdownIds, setTeamDropdownIds] = useState([])
  const [teamError, setTeamError] = useState()

  const [teamAnchorEl, setTeamAnchorEl] = useState(null)
  const [openTeamPopper, setOpenTeamPopper] = useState(false)

  const [loading, setLoading] = useState(true)

  const [singleUserData, setSingleUserData] = useState(userData)

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (userData) {
      setSingleUserData(userData)
    }
  }, [userData])

  // custom validators
  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      return 'Please enter a valid email address.'
    }

    return ''
  }

  const validatePassword = password => {
    if (password.length <= 5) return 'Password must be longer than 5 characters.'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.'
    if (!/[^a-zA-Z0-9]/.test(password)) return 'Password must contain at least one non-alphanumeric character.'

    return ''
  }

  // yup schema with custom test()
  const validationSchema = yup.object().shape({
    fullName: yup.string().min(1, 'Must be at least 1 character').required('This field is required'),
    userName: yup.string().min(1, 'Must be at least 1 character').required('This field is required'),
    emailId: yup
      .string()
      .required('This field is required')
      .test('is-valid-email', 'Please enter a valid email address.', value => {
        return validateEmail(value) === ''
      }),
    password: yup.string().when('$formType', {
      is: 'create',
      then: schema =>
        schema
          .required('Password is required')
          .test('is-strong-password', 'Invalid password', value => validatePassword(value) === '')
          .test('custom-password-errors', function (value) {
            const error = validatePassword(value || '')
            if (error) return this.createError({ message: error })

            return true
          }),
      otherwise: schema => schema.notRequired()
    }),
    address: yup.string().min(1, 'Must be at least 1 character').required('This field is required')
  })

  useEffect(() => {
    getTeamDropDown(set_team_dropdown, () => {})
    getAllRoles(set_role_dropdown)
  }, [])

  useEffect(() => {
    if (team_dropdown.length > 0 && role_dropdown.length > 0) {
      setLoading(false)
    }
  }, [team_dropdown, role_dropdown])

  // Initially Update Team DropdownUI and TeamMappingName and TeamDropdownIds
  useEffect(() => {
    if (singleUserData.teams.length > 0 && team_dropdown.length > 0) {
      const initialTeamName = []

      singleUserData.teams.map(id => {
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
  }, [singleUserData.teams, team_dropdown])

  // Initially Update Role DropdownUI and RoleMappingName and RoleDropdownIds
  useEffect(() => {
    if (singleUserData.roleId.length > 0 && role_dropdown.length > 0) {
      const initialRoleName = []

      singleUserData.roleId.map(id => {
        role_dropdown.find(role => {
          if (role.roleId == id) {
            if (!initialRoleName.includes(role.role)) {
              initialRoleName.push(role.role)
            }
          }
        })
      })
      setRoleMappingName(initialRoleName)
    }
  }, [singleUserData.roleId, role_dropdown])

  const handleChange = (name, value) => {
    setSingleUserData({ ...singleUserData, [name]: value })
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
    if (singleUserData) {
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

  // Role Change
  const handleRoleChange = value => {
    let arr = roleMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setRoleMappingName(arr)
  }
  useEffect(() => {
    if (singleUserData) {
      let roleIds = []

      roleMappingName.map(name => {
        role_dropdown.find(role => {
          if (role.role === name) {
            if (!roleIds.includes(role.roleId)) {
              roleIds.push(Number(role.roleId))
            }
          }
        })
      })
      setRoleDropdownIds([...roleIds])
    }
  }, [roleMappingName])

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(validationSchema, { context: { formType } }),
    mode: 'onSubmit',
    defaultValues: {
      ...singleUserData
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

    if (!isValidSelection(roleDropdownIds)) {
      setRoleError('Please select at least one')
      hasError = true
    } else {
      setRoleError('')
    }

    if (hasError) return

    const payload = {
      ...singleUserData,
      ...(formType === 'create' ? { Email: singleUserData.emailId } : {}),
      teams: teamDropdownIds,
      roleId: roleDropdownIds
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      if (userId) {
        res = await apiHelper(
          `${authConfig.authDevRakshitah_base_url}users/update/${singleUserData.id}`,
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
        res = await apiHelper(`${authConfig.authDevRakshitah_base_url}users/register`, 'post', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push('/home/settings/users')
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

  console.log('errors===>', errors)

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
              <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('fullName')}
                    id='outlined-fullName'
                    type='text'
                    label='Full Name *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleUserData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.fullName?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('userName')}
                    id='outlined-userName'
                    type='text'
                    label='Username *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleUserData.userName}
                    onChange={e => handleChange('userName', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.userName?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('emailId')}
                    id='outlined-emailId'
                    type='text'
                    label='Email *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleUserData.emailId}
                    onChange={e => handleChange('emailId', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.emailId?.message}</FormHelperText>
                </FormControl>
              </Grid>
              {formType === 'create' && (
                <Grid item xs={12} md={6} lg={4}>
                  <FormControl fullWidth>
                    <TextField
                      {...register('password')}
                      id='outlined-password'
                      type='text'
                      label='Password'
                      variant='outlined'
                      disabled={formType === 'view'}
                      value={singleUserData.password}
                      onChange={e => handleChange('password', e.target.value)}
                    />
                    <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.password?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              )}

              {/* Team */}
              <Grid item xs={12} md={6} lg={4}>
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
                            <Typography
                              variant='body2'
                              sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                            >
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

              {/* Role */}
              <Grid item xs={12} md={6} lg={4}>
                <Box sx={{ background: theme.palette.company.lighttertiary }}>
                  <Box
                    sx={{
                      height: '56px',
                      border: '1px solid',
                      background: openRolePopper ? theme.palette.company.primary : theme.palette.company.background,
                      borderColor: theme.palette.company.primary,
                      color: openRolePopper ? theme.palette.company.background : theme.palette.company.primary,
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={e => {
                      setRoleAnchorEl(openRolePopper ? '' : e.currentTarget)
                      setOpenRolePopper(openRolePopper ? false : true)
                    }}
                  >
                    Select Role
                  </Box>
                  {roleMappingName.length > 0 && (
                    <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {roleMappingName.map(item => {
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
                                handleRoleChange(item)
                              }}
                            >
                              {' '}
                              <ClearRoundedIcon
                                sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                              />{' '}
                            </Box>{' '}
                            <Typography
                              variant='body2'
                              sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
                <RolePopper
                  openRolePopper={openRolePopper}
                  setOpenRolePopper={setOpenRolePopper}
                  role_dropdown={role_dropdown}
                  roleMappingName={roleMappingName}
                  handleRoleChange={handleRoleChange}
                  roleAnchorEl={roleAnchorEl}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{roleError}</FormHelperText>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('address')}
                    id='outlined-address'
                    type='text'
                    label='Address *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleUserData.address}
                    onChange={e => handleChange('address', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.address?.message}</FormHelperText>
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

export default UserForm
