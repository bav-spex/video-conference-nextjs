import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import CloudUpload from '@mui/icons-material/CloudUpload'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { CommonSwal } from 'components/CommonSwal'
import ReactDraftWysiwyg from 'components/react-draft-wysiwyg'
import authConfig from 'configs/auth'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getAdditionlStakeHoldersDropDown,
  getDocumentTypeDropDown,
  getDocumentStatusDropDown,
  uploadFile
} from 'services/common'
import apiHelper from 'store/apiHelper'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Swal from 'sweetalert2'
import * as yup from 'yup'

import DocumentGrid from './documentGrid'
import DocumentViewer from './documentViewer'

const DocumentForm = ({ formType, documentId, documentData }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [file, setFile] = useState()
  const [type, setType] = useState('')

  const [documentType_dropdown, set_documentType_dropdown] = useState([])
  const [documentStatus_dropdown, set_documentStatus_dropdown] = useState([])
  const [documentApprover_dropdown, set_documentApprover_dropdown] = useState([])
  const [messageValue, setMessageValue] = useState(EditorState.createEmpty())
  const [documentsArray, setDocumentsArray] = useState([])
  const [open, setOpen] = useState(false)
  const [openDocumentViewer, setDocumentViewer] = useState(false)
  const [singleDocumentData, setSingleDocumentData] = useState(documentData)
  const [savingForm, setSavingForm] = useState(false)

  useEffect(() => {
    if (documentData) {
      setSingleDocumentData(documentData)
    }
  }, [documentData])

  const validationSchema = yup.object().shape({
    doc_name: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    approver: yup.number().notOneOf([0], 'Approver is required').required('Approver is required'),
    status: yup.number().notOneOf([0], 'Status is required').required('Status is required'),
    publish_date: yup.string().min(8, 'This field is required').required('This field is required'),
    next_review_date: yup.string().min(8, 'This field is required').required('This field is required'),
    scope: yup.string().min(1, 'Must be at least 1 characters').required('This field is required')
  })

  useEffect(() => {
    getDocumentTypeDropDown(set_documentType_dropdown, () => {})
    getDocumentStatusDropDown(set_documentStatus_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_documentApprover_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (
      documentType_dropdown.length > 0 &&
      documentStatus_dropdown.length > 0 &&
      documentApprover_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [documentType_dropdown, documentStatus_dropdown, documentApprover_dropdown])

  useEffect(() => {
    setMessageValue(
      EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(documentData?.purpose || '')))
    )
  }, [documentData])

  // Change Events for
  const handleChange = (name, value) => {
    setSingleDocumentData({ ...singleDocumentData, [name]: value })
  }

  // File Change
  const MAX_FILE_SIZE_MB = 50

  const handleFileChange = async e => {
    const fileData = e.target.files[0]

    if (fileData) {
      const fileSizeInMB = fileData.size / (1024 * 1024)

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        Swal.fire({
          icon: 'info',
          title: 'File too large!',
          text: `The selected file exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB.`
        })

        return
      }

      setFile(fileData)
    }
  }

  const uploadFileHandle = id => {
    if (file) {
      const selectedFile = file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('attachment', selectedFile, selectedFile.name)
      formData.append('RefType', 'Document')
      formData.append('RefId', id)
      formData.append('Version', '1')
      formData.append('FileType', selectedFile.type)

      uploadFile(formData)
    } else {
      return
    }
  }

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

  const handleOpenModel = list => {
    const documentArray = list.map(item => {
      return { filename: item.name, fileId: item.id }
    })

    setDocumentsArray(documentArray)
    setOpen(true)
  }

  const handleCancelModel = () => {
    setOpen(false)
    setDocumentsArray([])
  }

  const handleOpenDocumentViewer = () => {
    setDocumentViewer(true)
    setType(file.type)
  }

  const handleCancelDocumentViewer = () => {
    setDocumentViewer(false)
    setType('')
  }

  const handleFormSubmit = () => {
    const payload = {
      ...singleDocumentData,
      purpose: draftToHtml(convertToRaw(messageValue.getCurrentContent()))
    }
    onSubmit(payload, uploadFileHandle)
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    try {
      setSavingForm(true)
      let res
      if (formType === 'edit') {
        res = await apiHelper(
          `${authConfig.governanceDevRakshitah_base_url}documents/update/${documentId}`,
          'put',
          payload,
          {}
        )
        uploadFileHandle(documentId)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Update successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/new`, 'post', payload, {})
        uploadFileHandle(res.data.data.id)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }
      router.push(`/home/governance/documents`)
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
              {/* Document Type  */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    DocumentType
                  </InputLabel>
                  <Select
                    id='doc_type'
                    disabled={true}
                    value={singleDocumentData.doc_type}
                    fullWidth
                    label={'DocumentType'}
                    onChange={e => handleChange('doc_type', e.target.value)}
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
                    {documentType_dropdown
                      .filter(item => item.lookupName !== 'Evidence')
                      .map(item => (
                        <MenuItem key={item.lookupId} value={item.lookupId}>
                          {item.lookupName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Document Name  */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('doc_name')}
                    id='outlined-doc_name'
                    type='text'
                    label='Name *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleDocumentData.doc_name}
                    onChange={e => handleChange('doc_name', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.doc_name?.message}</FormHelperText>
                </FormControl>
              </Grid>
              {/* //Document Approver */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    {' '}
                    Document Approver *
                  </InputLabel>
                  <Select
                    {...register('approver')}
                    labelId='validation-basic-select'
                    id='approver'
                    value={singleDocumentData.approver}
                    onChange={e => handleChange('approver', e.target.value)}
                    label={'Document Approver'}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {documentApprover_dropdown.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.approver?.message}</FormHelperText>
                </FormControl>
              </Grid>
              {/* // Document Status */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.msg)}
                    htmlFor='validation-basic-select'
                  >
                    Document Status *
                  </InputLabel>
                  <Select
                    {...register('status')}
                    labelId='validation-basic-select'
                    value={singleDocumentData.status}
                    onChange={e => handleChange('status', e.target.value)}
                    label={'DocumentStatus'}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          width: 250
                        }
                      }
                    }}
                  >
                    {documentStatus_dropdown.map(item => (
                      <MenuItem key={item.id} value={item.lookupId}>
                        {item.lookupName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.status?.message}</FormHelperText>
                </FormControl>
              </Grid>
              {/* // Published Date */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('next_review_date')}
                    id='outlined-next_review_date'
                    label='Next Review Date'
                    type='date'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleDocumentData.next_review_date}
                    onChange={e => handleChange('next_review_date', e.target.value)}
                    inputProps={{ max: moment().format('YYYY-MM-DD') }} // Set max date to today's date
                  />
                </FormControl>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.next_review_date?.message}
                </FormHelperText>
              </Grid>
              {/* Next Review Date */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('publish_date')}
                    id='outlined-publish_date'
                    type='date'
                    label='Published Date'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleDocumentData.publish_date}
                    onChange={e => handleChange('publish_date', e.target.value)}
                    inputProps={{ min: singleDocumentData.publish_date }} // Set your minimum date here
                  />
                </FormControl>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.publish_date?.message}</FormHelperText>
              </Grid>
              {/* // Scope */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('scope')}
                    id='outlined-scope'
                    type='text'
                    label='Scope *'
                    variant='outlined'
                    disabled={formType === 'view'}
                    value={singleDocumentData.scope}
                    onChange={e => handleChange('scope', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.scope?.message}</FormHelperText>
                </FormControl>
              </Grid>

              {/* // Purpose Description */}
              <Grid item xs={12}>
                {/* <Box sx={{ background: theme.palette.company.tertiary, padding: '10px', borderRadius: '5px' }}> */}
                <InputLabel
                  sx={{ color: '#000', marginBottom: '5px' }}
                  id='validation-basic-select'
                  error={Boolean(errors.msg)}
                  htmlFor='validation-basic-select'
                >
                  Purpose Description
                </InputLabel>
                <Box
                  sx={{
                    background: theme.palette.company.background,
                    border: '1px solid',
                    borderColor: theme.palette.company.lightgrey,
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                >
                  <ReactDraftWysiwyg
                    editorState={messageValue}
                    onEditorStateChange={editorState => setMessageValue(editorState)}
                    placeholder='Message'
                  />
                </Box>
                {/* </Box> */}
              </Grid>
              <Grid item xs={12}>
                {' '}
                {/* File Upload */}
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
                      startIcon={<CloudUpload />}
                      sx={{
                        padding: '10px 20px',
                        width: 'fit-content',
                        height: '46px',
                        margin: '0px',
                        lineHeight: '18px'
                      }}
                    >
                      Upload Evidence
                    </Button>
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
                        onClick={() => handleOpenDocumentViewer()}
                        style={{ cursor: 'pointer' }}
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
                    handleCancelModel={handleCancelDocumentViewer}
                  ></DocumentViewer>

                  {documentData?.complianceFilesDtoList?.length > 0 && (
                    <Button
                      variant='outlined'
                      sx={{ padding: '10px 30px', width: 'fit-content', height: '46px', margin: '0px' }}
                      tabIndex={-1}
                      onClick={() => handleOpenModel(documentData.complianceFilesDtoList)}
                    >
                      Attachments
                    </Button>
                  )}
                </Box>
                <DocumentGrid
                  title={'Evidence List'}
                  documentsArray={documentsArray}
                  open={open}
                  handleCancelModel={handleCancelModel}
                ></DocumentGrid>
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

export default DocumentForm
