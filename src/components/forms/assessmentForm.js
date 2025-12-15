import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import authConfig from 'configs/auth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAdditionlStakeHoldersDropDown, getFindingStatusDropDown, getTeamDropDown } from 'services/common'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'

const AssessmentForm = ({ formType, assesmentId, assessmentData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])
  const [team_dropdown, set_team_dropdown] = useState([])
  const [status_dropdown, set_status_dropdown] = useState([])

  const [singleAssessmentData, setSingleAssessmentData] = useState({})

  useEffect(() => {
    if (assessmentData) {
      setSingleAssessmentData(assessmentData)
    }
  }, [assessmentData])

  useEffect(() => {
    getTeamDropDown(set_team_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown, () => {})
    getFindingStatusDropDown(set_status_dropdown, () => {})
  }, [])
  
  useEffect(() => {
    if (additionalstakeholders_dropdown.length > 0 && status_dropdown.length > 0 && team_dropdown.length > 0) {
      setLoading(false)
    }
  }, [additionalstakeholders_dropdown, status_dropdown, team_dropdown])

  // Change Events for
  // Test Name
  // Tester
  // Test Frequency
  // Date

  // ** Hooks
  const {
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Change Events for
  const handleChange = (name, value) => {
    setSingleAssessmentData({ ...singleAssessmentData, [name]: value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()

    const payload = {
      ...singleAssessmentData,
      additionalstakeholders: singleAssessmentData.additionalstakeholders,
      teams: singleAssessmentData.teams,
      testers: assessmentData.testers,
      lastassessmentdate: moment(singleAssessmentData.lastassessmentdate).format('MM/DD/YYYY'),
      assessmentDate: moment(singleAssessmentData.assessmentdate)
        .set({
          hour: 10,
          minute: 0,
          second: 0
        })
        .format('YYYY-MM-DDTHH:mm:ss')
    }
    onSubmit(payload)
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    try {
      let res
      res = await apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/update`, 'put', payload, {})
      Swal.fire({
        icon: 'success',
        title: 'Update successfully!',
        showConfirmButton: true
      })
      router.push(`/home/compliance/internalAudits/${router.query.frameworkId}/automation/test`)
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: `${err?.message} - ${err?.response?.data}`
      })
    }
  }

  return (
    <CardContent sx={{ padding: '0px' }}>
      <form onSubmit={e => handleSubmit(handleFormSubmit(e))}>
        <h3>{formType === 'edit' ? 'Edit Assessment' : 'Add Assessment'}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>Complete the form below to document a test </h5>

          <Grid
            item
            sx={{
              marginLeft: 'auto',
              '@media screen and (max-width:600px)': {
                flexDirection: 'row',
                marginLeft: 0
              }
            }}
            xs={12}
            md={4}
            style={{ display: 'flex', justifyContent: 'right', marginBottom: 20 }}
          >
            <Button
              xs={2}
              variant='contained'
              size='medium'
              onClick={() =>
                router.push(`/home/compliance/internalAudits/${router.query.frameworkId}/automation/test`)
              }
            >
              {t('Cancel')}
            </Button>
            <Button
              type='submit'
              size='medium'
              variant='contained'
              style={{ marginLeft: '10px' }}
              onClick={e => handleFormSubmit(e)}
            >
              Save
            </Button>
          </Grid>
        </div>
        <Divider />
        <Box className='hide-scrollbar' height={'700px'} overflow={'scroll'}>
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
            <Grid container spacing={2} marginTop={'10px'}>
              {/* Test Name  */}
              <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
                <FormControl fullWidth>
                  <TextField
                    type='text'
                    variant='outlined'
                    label={t('Test Name')}
                    name='testname'
                    value={singleAssessmentData.testname}
                    onChange={e => handleChange('testname', e.target.value)}
                    disabled
                  />
                </FormControl>
              </Grid>
              {/* Tester */}

              <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
                <FormControl fullWidth required>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Tester')}
                  </InputLabel>
                  <Select
                    required
                    value={singleAssessmentData.testers}
                    fullWidth
                    label={t('Tester')}
                    onChange={e => {
                      handleChange('testers', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    disabled
                  >
                    {additionalstakeholders_dropdown.map(c => (
                      <MenuItem key={c.id} value={Number(c.id)}>
                        {c.fullName}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.msg && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      please select testers
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* Additional Stakeholders  */}
              <Grid
                item
                sx={{
                  width: '40%',
                  marginBottom: '3vh',
                  '@media screen and (max-width:600px)': {
                    flexDirection: 'column',
                    marginLeft: 0
                  }
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Additional Stakeholders')}
                  </InputLabel>
                  <Select
                    value={singleAssessmentData.additionalstakeholders}
                    fullWidth
                    label={t('Additional Stakeholders')}
                    onChange={e => {
                      handleChange('additionalstakeholders', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    required
                    disabled
                  >
                    {additionalstakeholders_dropdown.map(c => (
                      <MenuItem key={c.id} value={Number(c.id)}>
                        {c.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.msg && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      please select additionalstakeholders
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* Team */}
              <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
                <FormControl fullWidth required>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Team')}
                  </InputLabel>
                  <Select
                    value={singleAssessmentData.teams}
                    fullWidth
                    label={t('Tester')}
                    onChange={e => {
                      handleChange('teams', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    required
                    disabled
                  >
                    {team_dropdown.map(c => (
                      <MenuItem key={c.id} value={Number(c.id)}>
                        {c.teamName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.msg && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      please select teams
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* Test Frequency  */}

              {/* Last Assessment Date  */}
              <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
                <FormControl fullWidth>
                  <TextField
                    type='date'
                    label='Last Assessment Date'
                    InputLabelProps={{ shrink: true }}
                    value={singleAssessmentData.lastassessmentdate}
                    onChange={e => handleChange('lastassessmentdate', e.target.value)}
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
                <FormControl fullWidth>
                  <TextField
                    type='number'
                    variant='outlined'
                    label={t('Test Frequency')}
                    name='testfrequency'
                    value={singleAssessmentData.testfrequency}
                    onChange={e => handleChange('testfrequency', e.target.value)}
                    disabled
                  />
                </FormControl>
              </Grid>
              {/* Last Assessment Date  */}
              <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
                <FormControl fullWidth>
                  <TextField
                    type='date'
                    label='Assessment Date'
                    InputLabelProps={{ shrink: true }}
                    value={singleAssessmentData.assessmentdate}
                    onChange={e => handleChange('assessmentdate', e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
                <FormControl fullWidth>
                  <TextField
                    type='number'
                    variant='outlined'
                    label={t('Approximate Time')}
                    name='approximateTime'
                    value={singleAssessmentData.approximateTime}
                    onChange={e => handleChange('approximateTime', e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                sx={{
                  width: '40%',
                  marginBottom: '3vh',
                  '@media screen and (max-width:600px)': {
                    flexDirection: 'column',
                    marginLeft: 0
                  }
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Status')}
                  </InputLabel>
                  <Select
                    value={singleAssessmentData.status}
                    fullWidth
                    label={t('Status')}
                    onChange={e => {
                      handleChange('status', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    required
                  >
                    {status_dropdown.map(c => (
                      <MenuItem key={c.id} value={c.lookupId}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.msg && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      please select status
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>
      </form>
    </CardContent>
  )
}

export default AssessmentForm
