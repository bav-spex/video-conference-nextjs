import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { getAdditionlStakeHoldersDropDown, getVendorStatusDropdown } from 'services/common'
import { getVendorAssessmentByVendorId } from 'services/thirdparty/vendorAssessment/VendorAssessmentServices'
import { getAllVendorFrameworks } from 'services/thirdparty/vendorFramework/vendorFrameworkServices'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

const AssessmentModal = ({
  vendorId,
  formType,
  setFormType,
  openAssessmentModal,
  setOpenAssessmentModal,
  singleAssessmentData,
  setSingleAssessmentData,
  setVendorAssessmentData
}) => {
  const theme = useTheme()
  const [frameworks_dropdown, set_frameworks_dropdown] = useState([])
  const [users_dropdown, set_users_dropdown] = useState([])
  const [vendor_assessment_status_dropdown, set_vendor_assessment_status_dropdown] = useState([])
  const [savingForm, setSavingForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllVendorFrameworks(set_frameworks_dropdown)
    getAdditionlStakeHoldersDropDown(set_users_dropdown)
    getVendorStatusDropdown(set_vendor_assessment_status_dropdown)
  }, [])

  useEffect(() => {
    if (frameworks_dropdown.length > 0 && users_dropdown.length > 0 && vendor_assessment_status_dropdown.length > 0) {
      setLoading(false)
    }
  }, [frameworks_dropdown, users_dropdown, vendor_assessment_status_dropdown])

  const validationSchema = yup.object().shape({
    assessmentStatus: yup.string().required('Assessment status is required'),
    frameworkId: yup.string().required('Framework is required'),
    reviewer: yup.string().required('Reviewer is required'),
    dueDate: yup.string().required('Due Date is required')
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit'
  })

  const handleFormSubmit = data => {
    setSavingForm(true)

    const payload = {
      dueDate: moment(data.dueDate).format('YYYY-MM-DD[T]HH:mm:ss'),
      assessmentStatus: data.assessmentStatus * 1,
      frameworkId: data.frameworkId * 1,
      reviewer: data.reviewer * 1,
      vendorId: vendorId * 1
    }
    onSubmit(payload)
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    console.log('payload===>', payload)
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/updateAssessment/${singleAssessmentData.assessmentId}`,
          'put',
          payload,
          {}
        )
        getVendorAssessmentByVendorId(vendorId, setVendorAssessmentData)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Update successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/createAssessment`,
          'post',
          payload,
          {}
        )
        getVendorAssessmentByVendorId(vendorId, setVendorAssessmentData)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }

      handleCancelAssessmentModal()
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

  const handleCancelAssessmentModal = () => {
    setFormType('')
    setOpenAssessmentModal(false)
    setSingleAssessmentData()
    setSavingForm(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
      }}
      open={openAssessmentModal}
    >
      {' '}
      <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
        <Typography variant='h4'>{formType === 'edit' ? 'Edit Assessment' : 'Create Assessmet'}</Typography>
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={handleCancelAssessmentModal}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <CloseIcon />
      </IconButton>
      {loading ? (
        <Box
          sx={{
            height: '20vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <CircularProgress disableShrink sx={{ mt: 6, color: theme.palette.company.primary }} />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
            <Grid container spacing={5}>
              {/* // Assessment Date */}
              {singleAssessmentData?.assessmentDate && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='assessmentDate'
                      control={control}
                      defaultValue={singleAssessmentData?.assessmentDate || ''}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <TextField
                            disabled
                            {...field}
                            type='date'
                            label='Assessment Date'
                            variant='outlined'
                            fullWidth
                            error={false} // ❗ Prevent red border
                            InputLabelProps={{ shrink: true }}
                          />
                          <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                            {errors.assessmentDate?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </FormControl>
                </Grid>
              )}
              {/* // Due Date */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='dueDate'
                    control={control}
                    defaultValue={singleAssessmentData?.dueDate || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          type='date'
                          label='Due Date'
                          variant='outlined'
                          fullWidth
                          error={false} // ❗ Prevent red border
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.dueDate?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* // framework */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    disabled
                    name='frameworkId'
                    control={control}
                    defaultValue={singleAssessmentData?.frameworkId || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id='frameworkId-label'>Framework</InputLabel>
                        <Select
                          {...field}
                          labelId='frameworkId-label'
                          label='Framework'
                          fullWidth
                          error={false}
                          disabled={formType === 'edit'}
                        >
                          {frameworks_dropdown.map(item => (
                            <MenuItem key={item.assessmentFrameworkId} value={item.assessmentFrameworkId}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.frameworkId?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* // Assessment Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='assessmentStatus'
                    control={control}
                    defaultValue={singleAssessmentData?.assessmentStatus || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id='assessmentStatus-label'>Assessment Status</InputLabel>
                        <Select
                          {...field}
                          labelId='assessmentStatus-label'
                          label='Assessment Status'
                          fullWidth
                          error={false}
                        >
                          {vendor_assessment_status_dropdown.map(item => (
                            <MenuItem key={item.id} value={item.lookupId}>
                              {item.lookupName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.assessmentStatus?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* // Reviewer */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='reviewer'
                    control={control}
                    defaultValue={singleAssessmentData?.reviewer || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id='reviewer-label'>Reviewer</InputLabel>
                        <Select {...field} labelId='reviewer-label' label='Reviewer' fullWidth error={false}>
                          {users_dropdown.map(item => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.fullName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.reviewer?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Risk Score */}
              {singleAssessmentData?.riskScore > 0 && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='riskScore'
                      control={control}
                      defaultValue={singleAssessmentData?.riskScore || ''}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <TextField
                            disabled
                            {...field}
                            label='Risk Score'
                            variant='outlined'
                            fullWidth
                            error={false} // ❗ Prevent red border
                            InputLabelProps={{ shrink: true }}
                          />
                          <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                            {errors.riskScore?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: { xs: '10px', sm: '20px' } }}>
            <Button
              onClick={handleCancelAssessmentModal}
              variant='outlined'
              sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='secondary'
              sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            >
              {savingForm ? <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}

export default AssessmentModal
