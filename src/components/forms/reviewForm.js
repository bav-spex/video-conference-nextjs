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
  getAssetTypeDropdown,
  getNextStepsDropDown,
  getSiteLocationDropDown
} from 'services/common'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'
import { decrypt, encrypt } from 'utils/routingEncryption'
import * as yup from 'yup'

const ReviewForm = ({ formType, reviewId, reviewData }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const riskId = decrypt(router.query.riskId)
  const [loading, setLoading] = useState(true)

  const [singleReviewData, setSingleReviewData] = useState(reviewData)

  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])
  const [nextstep_dropdown, set_nextstep_dropdown] = useState([])

  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (reviewData) {
      setSingleReviewData(reviewData)
    }
  }, [reviewData])

  useEffect(() => {
    getNextStepsDropDown(set_nextstep_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (additionalstakeholders_dropdown.length > 0 && nextstep_dropdown.length > 0) {
      setLoading(false)
    }
  }, [additionalstakeholders_dropdown, nextstep_dropdown])

  // auditName
  // categoryId
  // frameworkId
  // ownerId
  // statusId
  const handleChange = (name, value) => {
    setSingleReviewData({ ...singleReviewData, [name]: value })
  }

  const handleDateChange = (name, value) => {
    setSingleReviewData({ ...singleReviewData, [name]: value })
  }

  const validationSchema = yup.object().shape({
    review: yup.number().typeError('Review is required').required('Review is required'),
    reviewer: yup
      .number()
      .typeError('Reviewer is required')
      .min(1, 'Please select a valid reviewer')
      .required('Reviewer is required'),
    next_step: yup
      .number()
      .typeError('Next Step is required')
      .min(1, 'Please select a valid next step')
      .required('Next Step is required'),
    nextreviewdate: yup
      .string()
      .required('Next Review Date is required')
      .test('is-future-date', 'Next Review Date must be in the future', value =>
        moment(value).isAfter(moment(), 'day')
      ),
    comment: yup.string().required('Comment is required')
  })

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
      ...singleReviewData
    }
    onSubmit(payload)
  }

  const onSubmit = async payload => {
    try {
      setSavingForm(true)

      const payload = {
        ...singleReviewData,
        reviewdate: moment(singleReviewData.reviewdate).format('MM/DD/YYYY'),
        nextreviewdate: moment(singleReviewData.nextreviewdate).format('MM/DD/YYYY')
      }
      let res
      if (formType === 'edit') {
        res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}update/${reviewId}`, 'put', payload, {})
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Updated successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(
          `${authConfig.riskDevRakshitah_base_url}risk/${riskId}/reviews/submit`,
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
      router.push(`/home/riskManagement/risks/${encrypt(riskId)}/reviews`)
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
            <Grid container spacing={7.5} marginTop={'0px'}>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('reviewdate')}
                    type='date'
                    variant='outlined'
                    label={t('Review Date')}
                    name='reviewdate'
                    value={singleReviewData.reviewdate}
                    // onChange={e => handleDateChange('reviewdate', e.target.value)}
                    disabled={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                    {t('Reviewer')}
                  </InputLabel>
                  <Select
                    {...register('reviewer')}
                    value={singleReviewData.reviewer}
                    fullWidth
                    label={t('Reviewer')}
                    onChange={e => {
                      handleChange('reviewer', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {additionalstakeholders_dropdown.map(c => (
                      <MenuItem key={c.id} value={Number(c.id)}>
                        {c.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.reviewer?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('review')}
                    type='number'
                    style={{ width: '100%' }}
                    label={t('Review')}
                    name='review'
                    value={singleReviewData.review}
                    onChange={e => handleChange('review', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.review?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                    {t('Next Step')}
                  </InputLabel>
                  <Select
                    {...register('next_step')}
                    value={singleReviewData.next_step}
                    fullWidth
                    label={t('Next Step')}
                    onChange={e => {
                      handleChange('next_step', e.target.value)
                    }}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {nextstep_dropdown.map(c => (
                      <MenuItem key={c.lookupId} value={Number(c.lookupId)}>
                        {c.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.next_step?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('nextreviewdate')}
                    type='date'
                    variant='outlined'
                    label={t('Next Review Date')}
                    name='nextreviewdate'
                    value={singleReviewData.nextreviewdate}
                    onChange={e => handleDateChange('nextreviewdate', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                    {errors?.nextreviewdate?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('comment')}
                    type='text'
                    style={{ width: '100%' }}
                    label={t('Comments')}
                    name='comment'
                    value={singleReviewData.comment}
                    onChange={e => handleChange('comment', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors?.comment?.message}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                    variant='outlined'
                    onClick={() => router.push(`/home/riskManagement/risks/${encrypt(riskId)}/reviews`)}
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
                      t('Save')
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

export default ReviewForm
