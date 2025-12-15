import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAllFrameworks } from 'services/governance/frameworks/FrameworkServices'

const FrameworkForm = ({ formType, frameworkId, frameworkData, onSubmit }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [frameworks_dropdown, set_frameworks_dropdown] = useState([])

  const [singleFrameworkData, setSingleFrameworkData] = useState(frameworkData)
  useEffect(() => {
    getAllFrameworks(set_frameworks_dropdown)
  }, [])

  // Change Events for
  const handleChange = (name, value) => {
    setSingleFrameworkData({ ...singleFrameworkData, [name]: value })
  }

  const {
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handleFormSubmit = e => {
    e.preventDefault()

    const payload = {
      ...singleFrameworkData
    }
    onSubmit(payload)
  }

  return (
    <CardContent sx={{ padding: '0px' }}>
      <form onSubmit={e => handleSubmit(handleFormSubmit(e))}>
        <h3>{formType === 'edit' ? 'Edit Framework' : formType === 'view' ? 'Framework' : 'Add Framework'}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              onClick={() => router.push(`/home/compliance/internalAudits`)}
            >
              {t(`${formType !== 'view' ? 'Cancel' : 'Back'}`)}
            </Button>
            {formType !== 'view' && (
              <Button type='submit' size='medium' variant='contained' style={{ marginLeft: '10px' }} onClick={onSubmit}>
               Save
              </Button>
            )}
          </Grid>
        </div>
        {/* Framework Name */}
        <Grid item sx={{ marginBottom: '3vh', width: '100%' }}>
          <FormControl fullWidth>
            <TextField
              type='text'
              label='FrameWork Name'
              value={singleFrameworkData.framework_Name}
              onChange={e => handleChange('framework_Name', e.target.value)}
              disabled={formType === 'view'}
            />
          </FormControl>
        </Grid>
        {/* // Parent Framework */}
        <Grid item sx={{ marginBottom: '3vh', width: '100%' }}>
          <FormControl fullWidth required>
            <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
              Parent Framework
            </InputLabel>
            <Select
              value={singleFrameworkData.framework_Parent}
              fullWidth
              label={'Parent Framework'}
              onChange={e => handleChange('framework_Parent', e.target.value)}
              error={Boolean(errors?.msg)}
              labelId='validation-basic-select'
              aria-describedby='validation-basic-select'
              disabled={formType === 'view'}
              required
            >
              {frameworks_dropdown.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.framework_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Framework Description */}
        <Grid item sx={{ marginBottom: '3vh', width: '100%' }}>
          <FormControl fullWidth>
            <TextField
              type='text'
              label='Framework Description'
              value={singleFrameworkData.framework_Details}
              onChange={e => handleChange('framework_Details', e.target.value)}
              disabled={formType === 'view'}
            />
          </FormControl>
        </Grid>
        {/* Enable Dashboard */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <h5>{t('Enable Dashboard')}</h5>
          <Checkbox
            label='Enable Dashboard'
            name='enableDashboard'
            checked={singleFrameworkData.enableDashboard}
            onChange={event => handleChange('enableDashboard', event.target.checked)}
            disabled={formType === 'view'}
          />
        </Grid>
      </form>
    </CardContent>
  )
}

export default FrameworkForm
