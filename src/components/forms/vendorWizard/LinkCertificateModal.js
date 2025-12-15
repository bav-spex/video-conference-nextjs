import React, { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import CloudUpload from '@mui/icons-material/CloudUpload'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
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
  TextField,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { uploadFile } from 'services/common'
import { getSingleVendor } from 'services/thirdparty/vendors/vendorServices'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

import DocumentGrid from '../documentGrid'
import DocumentViewer from '../documentViewer'

const currentDate = moment().format('YYYY-MM-DD')

const LinkCertificateModal = ({
  handleFormSubmitForVendor,
  files,
  singleVendorData,
  setSingleVendorData,
  certificateFormType,
  setCertificateFormType,
  singleCertificateData,
  setSingleCertificateData,
  openLinkCertificateModal,
  setOpenLinkCertificateModal,
  setDocumentUploaded,
  setFiles
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [file, setFile] = useState()
  const [type, setType] = useState('')
  const [savingForm, setSavingForm] = useState(false)
  const [certificateArray, setCertificateArray] = useState([])
  const [openDocumentViewer, setDocumentViewer] = useState(false)
  const [openDocumentGrid, setOpenDocumentGrid] = useState(false)
  const [certificateFileError, setCertificateFileError] = useState(false)

  const handleCancelEvidenceModel = () => {
    setOpenLinkCertificateModal(false)
    setCertificateFormType('')
    setCertificateArray([])
    setFile(undefined)
    setType('')
    setSingleCertificateData(undefined)
    reset({
      fileId: 0,
      certificationId: '',
      expirationDate: currentDate,
      expirationDate: currentDate,
      certificationName: '',
      vendorId: 0
    })
  }
  // File Change
  const MAX_FILE_SIZE_MB = 50 // Limit in MB

  const handleFileChange = async e => {
    const fileData = e.target.files[0]

    if (fileData) {
      const fileSizeInMB = fileData.size / (1024 * 1024)

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        setOpenLinkEvidenceModal(false) // Close the Evidence Dialog
        setTimeout(() => {
          CommonSwal(theme, {
            icon: 'info',
            title: 'File too large!',
            text: `The selected file exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB.`,
            showConfirmButton: true,
            showCancelButton: true
          }).then(result => {
            if (result.isConfirmed) {
              setOpenLinkEvidenceModal(true)
            } else if (result.isDismissed) {
              setOpenLinkEvidenceModal(true)
            }
          })
        }, 300)

        return
      }
      setFile(fileData)
    }
  }

  const validationSchema = yup.object().shape({
    certificationId: yup.string().min(1, 'Name must be at least 3 characters').required('Document name is required'),
    certificationName: yup.string().min(3, 'Name must be at least 3 characters').required('Document name is required'),
    startDate: yup.date().typeError('Invalid date format (YYYY-MM-DD)').required('Start Date is required'),
    expirationDate: yup.date().typeError('Invalid date format (YYYY-MM-DD)').required('Expiration Date is required')
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

  // ✅ VENDOR FORM LOGIC
  const uploadFileHandle = async id => {
    const uploadAll = async (fileArray, refType) => {
      const promises = fileArray.map(selectedFile => {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('attachment', selectedFile, selectedFile.name)
        formData.append('RefType', refType)
        formData.append('RefId', id)
        formData.append('Version', '1')
        formData.append('FileType', selectedFile.type)

        return uploadFile(formData)
      })

      // ✅ Wait for all uploads to complete before returning
      const results = await Promise.all(promises)

      return results
    }

    try {
      if (files?.length) {
        const results = await uploadAll(files, 'VendorDocument')
        console.log('All uploads completed:', results)
      }

      setDocumentUploaded(true)
      setFiles([])

      return true // ✅ signal success only after all uploads finish
    } catch (error) {
      console.error('File upload failed:', error)
      setOpenLinkCertificateModal(false)

      setTimeout(() => {
        CommonSwal(theme, {
          icon: 'info',
          title: 'File upload failed. Please try again.',
          showConfirmButton: true,
          showCancelButton: true
        }).then(result => {
          setOpenLinkCertificateModal(true)
        })
      }, 300)

      return false
    }
  }

  // ✅ LINK CERTIFICATE MODAL
  const uploadCertificateFile = async id => {
    if (!file) return { fileId: null }

    const selectedFile = file
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('attachment', selectedFile, selectedFile.name)
    formData.append('RefType', 'VendorCertificate')
    formData.append('RefId', id)
    formData.append('Version', '1')
    formData.append('FileType', selectedFile.type)

    try {
      const response = await apiHelper(
        `${authConfig.authDevRakshitah_base_url}storage/uploadFile?provider=azure`,
        'post',
        formData
      )

      const fileId = response?.data?.data?.fileId || response?.data?.fileId || null

      return { fileId }
    } catch (error) {
      console.error('File upload failed:', error)
      setOpenLinkCertificateModal(false)

      setTimeout(() => {
        CommonSwal(theme, {
          icon: 'error',
          title: 'File upload failed. Please try again.',
          confirmButtonText: 'OK'
        }).then(() => {
          setOpenLinkCertificateModal(true)
        })
      }, 300)

      return false
    }
  }

  const handleFormSubmit = async data => {
    if (certificateFormType === 'create' && !file) {
      setCertificateFileError('Please upload file')

      return
    }

    setCertificateFileError('')
    setSavingForm(true)

    const payload = {
      ...singleCertificateData,
      ...data,
      startDate: moment(singleCertificateData.startDate).format('YYYY-MM-DD'),
      expirationDate: moment(singleCertificateData.expirationDate).format('YYYY-MM-DD')
    }

    try {
      // 🟣 EDIT MODE → Only update certificate, no uploads
      if (certificateFormType === 'edit') {
        await apiHelper(`${authConfig.complianceDevRakshitah_base_url}/vendor/updateCertificationVendor`, 'put', {
          ...payload,
          vendorId: singleVendorData.vendorId,
          fileId: singleCertificateData.fileId
        })

        CommonSwal(theme, {
          icon: 'success',
          title: 'Certificate updated successfully!',
          showConfirmButton: true
        })

        setCertificateFormType('')
        setSingleCertificateData()
        await getSingleVendor(singleVendorData.vendorId, setSingleVendorData)
        setOpenLinkCertificateModal(false)

        return
      }

      if (files?.length) {
        const uploadSuccess = await uploadFileHandle(singleVendorData.vendorId)
        if (!uploadSuccess) {
          setSavingForm(false)

          return // stop here if upload failed
        }
      }
      // ✅ Upload certificate file
      const { fileId } = await uploadCertificateFile(singleVendorData.vendorId)
      if (!fileId) {
        CommonSwal(theme, { icon: 'error', title: 'Certificate upload failed!' })
        setSavingForm(false)

        return
      }

      // ✅ Save new certificate details
      await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/createCertificationVendor`, 'post', {
        ...payload,
        vendorId: singleVendorData.vendorId,
        fileId
      })

      CommonSwal(theme, {
        icon: 'success',
        title: 'Certificate created successfully!',
        showConfirmButton: true
      })

      setSingleCertificateData()
      await getSingleVendor(singleVendorData.vendorId, setSingleVendorData)
      setOpenLinkCertificateModal(false)
      // TODO Bhavik please dont redirect
      // router.push('/home/thirdparty/vendors')
    } catch (err) {
      console.error('Certificate save failed:', err)
      CommonSwal(theme, {
        icon: 'error',
        title: err?.response?.data || 'Something went wrong!',
        confirmButtonText: 'OK'
      })
    } finally {
      setSavingForm(false)
    }
  }

  return (
    <>
      {/* Link Certificate Modal */}
      <Dialog
        fullWidth
        maxWidth='md'
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
        }}
        open={openLinkCertificateModal}
      >
        <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
          <Typography variant='h4'>Link Certificate</Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
            <Grid container spacing={5}>
              {/* // Certificate Name */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='certificationName'
                    control={control}
                    defaultValue={singleCertificateData?.certificationName || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          label='Certificate Name'
                          variant='outlined'
                          fullWidth
                          error={false} // ❗ Prevent red border
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.certificationName?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* // Certificate Id */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='certificationId'
                    control={control}
                    defaultValue={singleCertificateData?.certificationId || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          label='Certificate Id'
                          variant='outlined'
                          fullWidth
                          error={false} // ❗ Prevent red border
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.certificationId?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='startDate'
                    control={control}
                    defaultValue={singleCertificateData?.startDate || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          label='Start Date'
                          variant='outlined'
                          type='date'
                          fullWidth
                          error={false} // ❗ Prevent red border
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.startDate?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Controller
                    name='expirationDate'
                    control={control}
                    defaultValue={singleCertificateData?.expirationDate || ''}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          label='Expiration Date'
                          variant='outlined'
                          type='date'
                          fullWidth
                          error={false} // ❗ Prevent red border
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                          {errors.expirationDate?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* File Upload */}
              {certificateFormType === 'create' && (
                <Grid item xs={12} md={12}>
                  <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                    <FormControl sx={{ width: '30%' }}>
                      <input
                        type='file'
                        bg-color='primary'
                        id='uploadFile'
                        onChange={e => handleFileChange(e)}
                        name='img'
                        variant='outlined'
                        style={{ display: 'none' }}
                      />

                      <Button
                        component='label'
                        variant='outlined'
                        for='uploadFile'
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        sx={{
                          padding: '10px 20px',
                          width: 'fit-content',
                          height: '46px',
                          margin: '0px',
                          lineHeight: '18px'
                        }}
                      >
                        Upload Certificate
                      </Button>
                      {certificateFileError && (
                        <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{certificateFileError}</FormHelperText>
                      )}
                    </FormControl>

                    {file && (
                      <Box display={'flex'} alignItems={'center'} gap={5} maxWidth={'40%'}>
                        <Typography
                          variant='body1'
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '90%'
                          }}
                          key={0}
                        >
                          Selected File:{' '}
                          <Typography variant='body1Bold' sx={{ color: theme.palette.company.primary }}>
                            {' '}
                            {file.name}{' '}
                          </Typography>
                        </Typography>
                        <IconButton
                          onClick={() => {
                            setDocumentViewer(true)
                            setType(file.type)
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <RemoveRedEyeIcon sx={{ cursor: 'pointer' }} titleAccess='Download Evidence' />
                        </IconButton>
                      </Box>
                    )}
                    <DocumentViewer
                      file={file}
                      type={type}
                      open={openDocumentViewer}
                      handleCancelModel={() => {
                        setDocumentViewer(false)
                        setType('')
                      }}
                    ></DocumentViewer>
                    {singleCertificateData?.complianceFilesDtoList?.length > 0 && (
                      <Button
                        variant='outlined'
                        sx={{ padding: '10px 30px', width: 'fit-content', height: '46px', margin: '0px' }}
                        tabIndex={-1}
                        onClick={() => {
                          const documentArray = singleCertificateData?.complianceFilesDtoList.map(item => {
                            return { filename: item.name, fileId: item.id }
                          })

                          setCertificateArray(documentArray)
                          setOpenDocumentGrid(true)
                        }}
                      >
                        Attachments
                      </Button>
                    )}
                  </Box>
                </Grid>
              )}
              <DocumentGrid
                title={'Evidence List'}
                certificateArray={certificateArray}
                open={openDocumentGrid}
                handleCancelModel={() => {
                  setOpenDocumentGrid(false)
                  setCertificateArray([])
                }}
              ></DocumentGrid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: { xs: '10px', sm: '20px' } }}>
            <Button
              onClick={handleCancelEvidenceModel}
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
              {savingForm ? (
                <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
              ) : (
                t('Save')
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default LinkCertificateModal
