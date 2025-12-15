import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
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
import authConfig from 'configs/auth'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getControlRegulationDropDown, getControlStrengthDropDown } from 'services/common'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'
import * as yup from 'yup'

const RiskAnalysisForm = ({
  formType,
  riskId,
  riskData,
  setRiskData,
  setActiveStep,
  availableStep,
  setAvailableStep
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [controlregulation_dropdown, set_controlregulation_dropdown] = useState([])
  const [controlstrength_dropdown, set_controlstrength_dropdown] = useState([])

  const [singleRiskData, setSingleRiskData] = useState(null)

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (riskData) {
      setSingleRiskData({ ...riskData, control_strength: Number(riskData.control_strength) })
      reset({
        ...riskData,
        control_strength: Number(riskData.control_strength)
      })
    }
  }, [riskData])

  const validationSchema = yup.object().shape({
    existing_control: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    control_strength: yup
      .number()
      .notOneOf([0], 'Control regulation is required')
      .required('Control regulation is required')
  })

  useEffect(() => {
    getControlRegulationDropDown(set_controlregulation_dropdown, () => {})
    getControlStrengthDropDown(set_controlstrength_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (controlregulation_dropdown.length > 0 && controlstrength_dropdown.length > 0) {
      setLoading(false)
    }
  }, [controlregulation_dropdown, controlstrength_dropdown])

  // Change Events for
  // Existing Control
  // Control Strength
  // Control Regulation
  const handleChange = (name, value) => {
    setSingleRiskData(prev => ({ ...prev, [name]: value }))
  }

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...riskData
    }
  })

  const handleFormSubmit = () => {
    const payload = {
      ...singleRiskData
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}risks/update/${payload.id}`, 'put', payload, {})
      setRiskData(singleRiskData)
      setActiveStep(2)
      setAvailableStep(2)
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: `${err?.message} - ${err?.response?.data}`
      })
    } finally {
      setSavingForm(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant='h4' sx={{ marginBottom: { xs: '16px', md: '20px' } }}>
          Risk Analysis
        </Typography>
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
            {/* Existing Control  */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('existing_control')}
                  id='outlined-existing_control'
                  label={t('Existing Control *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleRiskData.existing_control}
                  onChange={e => handleChange('existing_control', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.existing_control?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Control Stregth  */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                  {t('Control Strength *')}
                </InputLabel>
                <Select
                  {...register('control_strength')}
                  fullWidth
                  label={t('Control Strength *')}
                  value={singleRiskData.control_strength}
                  onChange={e => handleChange('control_strength', e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {controlstrength_dropdown.map(c => (
                    <MenuItem key={c.lookupId} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.control_strength?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Control Regulation  */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                  {t('Control Regulation *')}
                </InputLabel>
                <Select
                  {...register('controlregulation')}
                  fullWidth
                  label={t('Control Regulation *')}
                  value={singleRiskData.controlregulation}
                  onChange={e => handleChange('controlregulation', Number(e.target.value))}
                  disabled={true}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {controlregulation_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.framework_Name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.controlregulation?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Risk Value  */}
            <Grid item xs={12} sm={6} lg={4}>
              {singleRiskData.risk_value && (
                <Grid item xs={12} sm={6} lg={4}>
                  <FormControl fullWidth>
                    <TextField
                      {...register('risk_value')}
                      id='outlined-risk_value'
                      label={t('Risk Value *')}
                      variant='outlined'
                      disabled={true}
                      value={singleRiskData.risk_value}
                      onChange={e => handleChange('risk_value', e.target.value)}
                    />
                    <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                      {errors.risk_value?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} sm={6} lg={4}></Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  variant='outlined'
                  onClick={() => setActiveStep(0)}
                  sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                >
                  {t('Back')}
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

export default RiskAnalysisForm
