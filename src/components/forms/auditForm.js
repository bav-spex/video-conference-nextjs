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
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getAdditionlStakeHoldersDropDown,
  getAuditStatusDropDown,
  getCategoryDropDown,
  getFrameworkDropDown
} from 'services/common'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'
import * as yup from 'yup'

const AuditForm = ({ formType, auditId, auditData }) => {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const [framework_dropdown, set_framework_dropdown] = useState([])
  const [category_dropdown, set_category_dropdown] = useState([])
  const [audit_status_dropdown, set_audit_status_dropdown] = useState([])
  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])

  const [singleAuditData, setSingleAuditData] = useState(auditData)

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (auditData) {
      setSingleAuditData(auditData)
    }
  }, [auditData])

  const validationSchema = yup.object().shape({
    auditDate: yup.string().required('Audit Date is required'),
    auditName: yup.string().min(1, 'Audit Name is required').required('Audit Name is required'),
    categoryId: yup.number().notOneOf([0], 'Category is required').required('Category is required'),
    frameworkId: yup.number().notOneOf([0], 'Framework is required').required('Framework is required'),
    ownerId: yup.number().notOneOf([0], 'Owner is required').required('Owner is required'),
    statusId: yup.number().notOneOf([0], 'Status is required').required('Status is required')
  })

  useEffect(() => {
    getFrameworkDropDown(set_framework_dropdown, () => {})
    getCategoryDropDown(set_category_dropdown, () => {})
    getAuditStatusDropDown(set_audit_status_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (
      framework_dropdown.length > 0 &&
      category_dropdown.length > 0 &&
      audit_status_dropdown.length > 0 &&
      additionalstakeholders_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [framework_dropdown, category_dropdown, audit_status_dropdown, additionalstakeholders_dropdown])

  // Change Events for
  const handleChange = (name, value) => {
    setSingleAuditData({ ...singleAuditData, [name]: value })
  }

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit'
  })

  const handleFormSubmit = () => {
    const payload = {
      ...singleAuditData,
      auditDate: moment(singleAuditData.auditDate).format('MM/DD/YYYY')
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit/${auditId}`, 'put', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Edited successfully!',
          showConfirmButton: true
        })
      } else {
        res = apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit`, 'post', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push(`/home/compliance/externalAudits`)
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
                  {...register('auditDate')}
                  type='date'
                  label={t('Audit Date')}
                  value={singleAuditData.auditDate}
                  onChange={e => handleChange('auditDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: moment().format('YYYY-MM-DD') }}
                />
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.auditDate?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('auditName')}
                  label={t('Audit Name *')}
                  value={singleAuditData.auditName}
                  onChange={e => handleChange('auditName', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.auditName?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>{t('Category *')}</InputLabel>
                <Select
                  {...register('categoryId')}
                  value={singleAuditData.categoryId}
                  onChange={e => handleChange('categoryId', e.target.value)}
                  label={t('Category *')}
                >
                  {category_dropdown.map(c => (
                    <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.categoryId?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>{t('Framework *')}</InputLabel>
                <Select
                  {...register('frameworkId')}
                  value={singleAuditData.frameworkId}
                  onChange={e => handleChange('frameworkId', e.target.value)}
                  label={t('Framework *')}
                >
                  {framework_dropdown.map(c => (
                    <MenuItem key={c.id} value={Number(c.id)}>
                      {c.framework_Name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.frameworkId?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>{t('Owner *')}</InputLabel>
                <Select
                  {...register('ownerId')}
                  value={singleAuditData.ownerId}
                  onChange={e => handleChange('ownerId', e.target.value)}
                  label={t('Owner *')}
                >
                  {additionalstakeholders_dropdown.map(c => (
                    <MenuItem key={c.id} value={Number(c.id)}>
                      {c.fullName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.ownerId?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>{t('Audit Status *')}</InputLabel>
                <Select
                  {...register('statusId')}
                  value={singleAuditData.statusId}
                  onChange={e => handleChange('statusId', e.target.value)}
                  label={t('Audit Status *')}
                >
                  {audit_status_dropdown.map(c => (
                    <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: 0 }}>{errors.statusId?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  variant='outlined'
                  onClick={() => router.push(`/home/compliance/externalAudits`)}
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
  )
}

export default AuditForm
