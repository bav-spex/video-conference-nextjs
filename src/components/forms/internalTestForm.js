import React, { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import authConfig from 'configs/auth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  getAdditionlStakeHoldersDropDown,
  getControlDropDown,
  getFindingStatusDropDown,
  getTeamDropDown
} from 'services/common'
import apiHelper from 'store/apiHelper'

const InternalTestForm = ({ formType, testId, testData }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])
  const [additionalstakeholdersMappingName, setAdditionalstakeholdersMappingName] = useState([])
  const [additionalstakeholdersDropdownIds, setAdditionalstakeholdersDropdownIds] = useState([])

  const [teams_dropdown, set_teams_dropdown] = useState([])
  const [teamsMappingName, setTeamsMappingName] = useState([])
  const [teamsDropdownIds, setTeamsDropdownIds] = useState([])

  const [testerMappingName, setTesterMappingName] = useState([])
  const [testerDropdownIds, setTesterDropdownIds] = useState([])

  const [control_dropdown, set_control_dropdown] = useState([])
  const [status_dropdown, set_status_dropdown] = useState([])

  const [singleTestData, setSingleTestData] = useState({
    ...testData,
    lastAssessmentDate: moment(testData.lastAssessmentDate).format('YYYY-MM-DD')
  })

  useEffect(() => {
    getTeamDropDown(set_teams_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown, () => {})
    getControlDropDown(set_control_dropdown)
    getFindingStatusDropDown(set_status_dropdown, () => {})
  }, [])

  // Initially Update AdditionalStackHolders DropdownUI and AdditionalStackHoldersMappingName and additionalstakeholdersDropdownIds
  useEffect(() => {
    if (singleTestData.additionalStakeholders?.length > 0 && additionalstakeholders_dropdown.length > 0) {
      const initialStackName = []

      singleTestData.additionalStakeholders.map(id => {
        additionalstakeholders_dropdown.find(stack => {
          if (stack.id == id) {
            if (!initialStackName.includes(stack.fullName)) {
              initialStackName.push(stack.fullName)
            }
          }
        })
      })
      setAdditionalstakeholdersMappingName(initialStackName)
    }
  }, [additionalstakeholders_dropdown, singleTestData.additionalStakeholders])

  // Initially Update Teams DropdownsUI and teamsMappoingName and teamsDropdownIds
  useEffect(() => {
    if (singleTestData.teams?.length > 0 && teams_dropdown.length > 0) {
      const initialTeamsName = []

      singleTestData.teams.map(id => {
        teams_dropdown.find(teams => {
          if (teams.id == id) {
            if (!initialTeamsName.includes(teams.teamName)) {
              initialTeamsName.push(teams.teamName)
            }
          }
        })
      })
      setTeamsMappingName(initialTeamsName)
    }
  }, [teams_dropdown, singleTestData.teams])

  // Initially Update Tester DropdownsUI and testerMappingName and testerDropdownIds
  useEffect(() => {
    if (singleTestData.tester?.length > 0 && additionalstakeholders_dropdown.length > 0) {
      const initialTesterName = []

      singleTestData.tester.map(id => {
        additionalstakeholders_dropdown.find(tester => {
          if (tester.id == id) {
            if (!initialTesterName.includes(tester.fullName)) {
              initialTesterName.push(tester.fullName)
            }
          }
        })
      })
      setTesterMappingName(initialTesterName)
    }
  }, [additionalstakeholders_dropdown, singleTestData.tester])

  // Change Events for
  // Test Name
  // Tester
  // Test Frequency
  // Control
  // Controlid
  // Controlnumber
  // Objective
  // Test Steps
  // Approximate Time
  // Date
  // Expected Results
  // Tags

  // Additional Stake Holders Change
  const handleAdditionalStakeHoldersChange = event => {
    const {
      target: { value }
    } = event

    setAdditionalstakeholdersMappingName(typeof value === 'string' ? value.split(',') : value)
  }
  useEffect(() => {
    if (singleTestData) {
      let stakeHolderIds = []

      additionalstakeholdersMappingName.map(name => {
        additionalstakeholders_dropdown.find(stake => {
          if (stake.fullName === name) {
            if (!stakeHolderIds.includes(stake.id)) {
              stakeHolderIds.push(stake.id)
            }
          }
        })
      })
      setAdditionalstakeholdersDropdownIds([...stakeHolderIds])
    }
  }, [additionalstakeholdersMappingName])

  // Team Change
  const handleTeamsChange = event => {
    const {
      target: { value }
    } = event

    setTeamsMappingName(typeof value === 'string' ? value.split(',') : value)
  }
  useEffect(() => {
    if (singleTestData) {
      let teamsIds = []

      teamsMappingName.map(name => {
        teams_dropdown.find(teams => {
          if (teams.teamName === name) {
            if (!teamsIds.includes(teams.id)) {
              teamsIds.push(teams.id)
            }
          }
        })
      })
      setTeamsDropdownIds([...teamsIds])
    }
  }, [teamsMappingName])

  // Tester Change
  const handleTesterChange = event => {
    const {
      target: { value }
    } = event

    setTesterMappingName(typeof value === 'string' ? value.split(',') : value)
  }
  useEffect(() => {
    if (singleTestData) {
      let testerIds = []

      testerMappingName.map(name => {
        additionalstakeholders_dropdown.find(tester => {
          if (tester.fullName === name) {
            if (!testerIds.includes(tester.id)) {
              testerIds.push(tester.id)
            }
          }
        })
      })
      setTesterDropdownIds([...testerIds])
    }
  }, [testerMappingName])

  // ** Hooks
  const {
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Change Events for
  const handleChange = (name, value) => {
    setSingleTestData({ ...singleTestData, [name]: value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()

    const payload = {
      ...singleTestData,
      additionalStakeholders: additionalstakeholdersDropdownIds,
      teams: teamsDropdownIds,
      testers: testerDropdownIds
    }
    delete payload.testId
    delete payload.control
    delete payload.tester

    onSubmit(payload)
  }

  const onSubmit = payload => {
    if (testId) {
      apiHelper(`${authConfig.complianceDevRakshitah_base_url}test/update/${testId}`, 'post', payload, {})
        .then(res => {
          toast.success('Test Updated Successfully')
          router.push('/home/compliance/internalAudits/${router.query.frameworkControlId}/automation/test')
        })
        .catch(err => {
          console.log('err')

          console.log(err)
        })
    } else {
      apiHelper(`${authConfig.complianceDevRakshitah_base_url}test/new`, 'post', payload, {})
        .then(res => {
          toast.success('Test Created Successfully')
          router.push('/home/compliance/internalAudits/${router.query.frameworkControlId}/automation/test')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <CardContent sx={{ padding: '0px' }}>
      <form onSubmit={e => handleSubmit(handleFormSubmit(e))}>
        <h3>{formType === 'edit' ? 'Edit Test' : 'Add Test'}</h3>
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
                router.push(`/home/compliance/internalAudits/${router.query.frameworkControlId}/automation/test`)
              }
            >
              {t('Cancel')}
            </Button>
            <Button type='submit' size='medium' variant='contained' style={{ marginLeft: '10px' }} onClick={onSubmit}>
            Save
            </Button>
          </Grid>
        </div>

        <Grid container spacing={2} marginTop={'10px'}>
          {/* Test Name  */}
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='text'
                variant='outlined'
                label={t('Test Name')}
                name='testName'
                value={singleTestData.testName}
                onChange={e => handleChange('testName', e.target.value)}
              />
            </FormControl>
          </Grid>
          {/* Tester */}

          <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth required>
              <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                {t('Testers')}
              </InputLabel>
              <Select
                multiple
                value={testerMappingName}
                fullWidth
                label={t('Testers')}
                onChange={handleTesterChange}
                error={Boolean(errors?.msg)}
                labelId='validation-basic-select'
                aria-describedby='validation-basic-select'
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {additionalstakeholders_dropdown.map(item => (
                  <MenuItem key={item.id} value={item.fullName}>
                    {item.fullName}
                  </MenuItem>
                ))}
              </Select>
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
              <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                {t('Additional Stakeholders')}
              </InputLabel>
              <Select
                multiple
                value={additionalstakeholdersMappingName}
                fullWidth
                label={t('Additional Stakeholders')}
                onChange={handleAdditionalStakeHoldersChange}
                error={Boolean(errors?.msg)}
                labelId='validation-basic-select'
                aria-describedby='validation-basic-select'
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {additionalstakeholders_dropdown.map(item => (
                  <MenuItem key={item.id} value={item.fullName}>
                    {item.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Team */}
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth required>
              <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                {t('Teams')}
              </InputLabel>
              <Select
                multiple
                value={teamsMappingName}
                fullWidth
                label={t('Teams')}
                onChange={handleTeamsChange}
                error={Boolean(errors?.msg)}
                labelId='validation-basic-select'
                aria-describedby='validation-basic-select'
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {/* <MenuItem value=''>None</MenuItem> */}
                {teams_dropdown.map(item => (
                  <MenuItem key={item.id} value={item.teamName}>
                    {item.teamName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Test Frequency  */}
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='number'
                variant='outlined'
                label={t('Test Frequency')}
                name='testFrequency'
                value={singleTestData.testFrequency}
                onChange={e => handleChange('testFrequency', e.target.value)}
              />
            </FormControl>
          </Grid>
          {/* Control */}
          <Grid item sx={{ width: '40%' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth required>
              <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                {t('Control')}
              </InputLabel>
              <Select
                value={singleTestData.frameworkControlId}
                fullWidth
                label={t('Control')}
                onChange={e => {
                  handleChange('frameworkControlId', e.target.value)
                }}
                labelId='validation-basic-select'
                aria-describedby='validation-basic-select'
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {control_dropdown.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {`${c['control-number']} - ${c.name}`}
                  </MenuItem>
                ))}
              </Select>
            
            </FormControl>
          </Grid>
          <Grid item sx={{ width: '100%', marginBottom: '3vh' }}>
            <FormControl fullWidth required>
              <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                {t('Status')}
              </InputLabel>
              <Select
                value={singleTestData.status}
                fullWidth
                label={t('Status')}
                onChange={e => {
                  handleChange('status', e.target.value)
                }}
                labelId='validation-basic-select'
                aria-describedby='validation-basic-select'
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
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
          {/* Objective  */}
          <Grid item sx={{ width: '100%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='text'
                variant='outlined'
                label={t('Objective')}
                name='objective'
                value={singleTestData.objective}
                onChange={e => handleChange('objective', e.target.value)}
              />
            </FormControl>
          </Grid>
          {/* Test Steps  */}
          <Grid item sx={{ width: '100%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='text'
                variant='outlined'
                label={t('Test Steps')}
                name='testSteps'
                value={singleTestData.testSteps}
                onChange={e => handleChange('testSteps', e.target.value)}
              />
            </FormControl>
          </Grid>

          {/* Approximate Time  */}
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='number'
                variant='outlined'
                label={t('Approximate Time')}
                name='approximateTime'
                value={singleTestData.approximateTime}
                onChange={e => handleChange('approximateTime', e.target.value)}
              />
            </FormControl>
          </Grid>
          {/* Last Assessment Date  */}
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth>
              <TextField
                type='date'
                label='Last Assessment Date'
                InputLabelProps={{ shrink: true }}
                value={singleTestData.lastAssessmentDate}
                onChange={e => handleChange('lastAssessmentDate', e.target.value)}
              />
            </FormControl>
          </Grid>

          {/* Expected Results  */}
          <Grid item sx={{ width: '100%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='text'
                variant='outlined'
                label={t('Expected Results')}
                name='expectedResults'
                value={singleTestData.expectedResults}
                onChange={e => handleChange('expectedResults', e.target.value)}
              />
            </FormControl>
          </Grid>
          {/* Tags  */}
          <Grid item sx={{ width: '100%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='text'
                variant='outlined'
                label={t('Tags')}
                name='tags'
                value={singleTestData.tags}
                onChange={e => handleChange('tags', e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default InternalTestForm
