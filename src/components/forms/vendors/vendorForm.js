import React, { useEffect, useMemo, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloudUpload from '@mui/icons-material/CloudUpload'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  FormHelperText,
  Typography,
  IconButton,
  Divider
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CommonSwal } from 'components/CommonSwal'
import CommonTable from 'components/CommonTable'
import TableTextTooltip from 'components/TableTextTooltip'
import authConfig from 'configs/auth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getVendorStatusDropdown,
  getBase64StringFromFileId,
  getCriticalDropdown,
  getFrequencyDropdown,
  getServiceDropdown,
  getVendorTypeDropdown,
  uploadFile
} from 'services/common'
import { getSingleVendor } from 'services/thirdparty/vendors/vendorServices'
import apiHelper from 'store/apiHelper'
import { convertDateFormat } from 'utils/common'
import { withEnvPath } from 'utils/misc'
import * as yup from 'yup'

import DocumentGrid from '../documentGrid'
import DocumentViewer from '../documentViewer'
import LinkCertificateModal from './LinkCertificateModal'
import ServiceMappingDrawer from './serviceMappingDrawer'

const isValidEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const currentDate = moment().format('YYYY-MM-DD')

const VendorForm = ({ formType, vendorId, vendorData }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [singleVendorData, setSingleVendorData] = useState({
    ...vendorData
  })
  const [critical_dropdown, set_critical_dropdown] = useState([])
  const [vendorType_dropdown, set_vendorType_dropdown] = useState([])
  const [frequency_dropdown, set_frequency_dropdown] = useState([])
  const [vendor_status_dropdown, set_vendor_status_dropdown] = useState([])
  const [savingForm, setSavingForm] = useState(false)

  const [service_dropdown, set_service_dropdown] = useState([])
  const [serviceMappingName, setServiceMappingName] = useState([])
  const [serviceDropdownIds, setServiceDropdownIds] = useState([])
  const [serviceError, setServiceError] = useState()
  const [openServiceMappingDrawer, setOpenServiceMappingDrawer] = useState(false)

  // Multiple file support
  const [files, setFiles] = useState([]) // multiple vendor documents
  const [certificateFiles, setCertificateFiles] = useState([]) // multiple certificates

  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [documentsArray, setDocumentsArray] = useState([])
  const [certificatesArray, setCertificatesArray] = useState([])
  const [open, setOpen] = useState(false)
  const [openCertificate, setOpenCertificate] = useState(false)
  const [openDocumentViewer, setDocumentViewer] = useState(false)
  const [openCertificateViewer, setCertificateViewer] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedCertificateFile, setSelectedCertificateFile] = useState(null)
  const [fileType, setFileType] = useState('')

  const [openLinkCertificateModal, setOpenLinkCertificateModal] = useState(false)
  const [certificateFormType, setCertificateFormType] = useState('')

  const [singleCertificateData, setSingleCertificateData] = useState()
  const [expandCertificate, setExpandCertificate] = useState(false)
  // Certificates Table Pagination
  const [certificatesPageSize, setCertificatesPageSize] = useState(10) // Default certificatesPage size
  const [certificatesPage, setCertificatesPage] = useState(0) // Default certificatesPage

  useEffect(() => {
    getServiceDropdown(set_service_dropdown)
    getFrequencyDropdown(set_frequency_dropdown)
    getVendorTypeDropdown(set_vendorType_dropdown)
    getCriticalDropdown(set_critical_dropdown)
    getVendorStatusDropdown(set_vendor_status_dropdown)
  }, [])

  useEffect(() => {
    if (vendorData) {
      setSingleVendorData(vendorData)
    }
  }, [vendorData])

  useEffect(() => {
    if (
      service_dropdown.length > 0 &&
      frequency_dropdown.length > 0 &&
      vendorType_dropdown.length > 0 &&
      critical_dropdown.length > 0 &&
      vendor_status_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [vendor_status_dropdown, critical_dropdown, service_dropdown, vendorType_dropdown, frequency_dropdown])

  // Initially Update Service DropdownUI and ServiceMappingName and ServiceDropdownIds
  useEffect(() => {
    if (singleVendorData?.services?.length > 0 && service_dropdown?.length > 0) {
      const initialServiceName = []

      singleVendorData.services.map(id => {
        service_dropdown.find(service => {
          if (service.lookupId == id) {
            if (!initialServiceName.includes(service.lookupName)) {
              initialServiceName.push(service.lookupName)
            }
          }
        })
      })
      setServiceMappingName(initialServiceName)
    }
  }, [singleVendorData.services, service_dropdown])

  const validationSchema = yup.object().shape({
    name: yup.string().min(1, 'Must be at least 3 characters').required('This field is required'),
    email: yup.string().email().required()
  })

  const handleChange = (name, value) => {
    setSingleVendorData(prev => ({ ...prev, [name]: value }))
  }

  // -------------------- FILE HANDLERS --------------------
  const MAX_FILE_SIZE_MB = 50

  const handleFileChange = (e, refType = 'VendorDocument') => {
    const selected = Array.from(e.target.files)
    const validFiles = []

    selected.forEach(file => {
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        CommonSwal(theme, {
          icon: 'info',
          title: 'File too large!',
          text: `${file.name} exceeds ${MAX_FILE_SIZE_MB} MB limit.`
        })
      } else {
        validFiles.push(file)
      }
    })

    if (refType === 'VendorDocument') {
      setFiles(prev => [...prev, ...validFiles])
    } else {
      setCertificateFiles(prev => [...prev, ...validFiles])
    }
  }

  const handleRemoveFile = (index, refType = 'VendorDocument') => {
    if (refType === 'VendorDocument') {
      setFiles(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handlePreviewFile = (file, refType = 'VendorDocument') => {
    if (refType === 'VendorDocument') {
      setSelectedFile(file)
      setFileType(file.type)
      setDocumentViewer(true)
    } else {
      setSelectedCertificateFile(file)
      setCertificateType(file.type)
      setCertificateViewer(true)
    }
  }

  // -------------------- SERVICE CHANGE --------------------
  const handleServiceChange = value => {
    let arr = serviceMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setServiceMappingName(arr)
  }

  useEffect(() => {
    if (singleVendorData) {
      let serviceIds = []

      serviceMappingName.map(name => {
        service_dropdown.find(service => {
          if (service.lookupName === name) {
            if (!serviceIds.includes(service.lookupId)) {
              serviceIds.push(service.lookupId)
            }
          }
        })
      })
      setServiceDropdownIds([...serviceIds])
    }
  }, [serviceMappingName])

  const {
    handleSubmit,
    formState: { errors, isValid },
    register
  } = useForm({ resolver: yupResolver(validationSchema), mode: 'onSubmit' })

  const handleOpenDocumentGridModel = list => {
    const documentArray = list.map(item => {
      return { filename: item.name, fileId: item.fileId }
    })
    setDocumentsArray(documentArray)
    setOpen(true)
  }

  const handleCancelDocumentGridModel = () => {
    setOpen(false)
    setDocumentsArray([])
  }

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
      setDocumentUploaded(true)
      setFiles([])

      return Promise.all(promises)
    }

    try {
      if (files?.length) await uploadAll(files, 'VendorDocument')
      setFiles([])

      return true
    } catch (error) {
      console.error('File upload failed:', error)
      CommonSwal(theme, {
        icon: 'error',
        title: 'File upload failed. Please try again.',
        confirmButtonText: 'OK'
      })

      return false
    }
  }

  const handleFormSubmitForVendor = async () => {
    const payload = {
      ...singleVendorData,
      name: singleVendorData.name?.trim(),
      email: singleVendorData.email?.trim(),
      moblieNumber: singleVendorData.moblieNumber?.trim() ?? '',
      primaryContactPersonName: singleVendorData.primaryContactPersonName?.trim(),
      primaryContactPersonEmail: singleVendorData.primaryContactPersonEmail?.trim(),
      primaryContactPersonContactNumber: singleVendorData.primaryContactPersonContactNumber?.trim() ?? '',
      critical: singleVendorData.critical ?? 0,
      status: singleVendorData.status ?? 0,
      assessmentFrequency: singleVendorData.assessmentFrequency ?? 0,
      type: singleVendorData.type ?? 0,
      services: serviceDropdownIds ?? []
    }

    const vendorId = await onSubmit(payload, uploadFileHandle)

    return vendorId
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    let finalVendorId = singleVendorData.vendorId || null
    try {
      setSavingForm(true)
      let res

      if (finalVendorId) {
        // ✅ Update existing vendor
        res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendor/update/${finalVendorId}`,
          'put',
          payload,
          {}
        )

        await uploadFileHandle(finalVendorId) // upload vendor documents if added

        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Vendor updated successfully!',
          showConfirmButton: true
        })
      } else {
        // ✅ Create new vendor
        res = await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/save`, 'post', payload, {})
        const newId = res?.data?.vendorId || res?.data?.data?.vendorId
        finalVendorId = newId

        setSingleVendorData(prev => ({ ...prev, vendorId: newId }))
        await uploadFileHandle(newId)

        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Vendor added successfully!',
          showConfirmButton: true
        })
      }

      return finalVendorId
    } catch (err) {
      console.error('Vendor save failed:', err)
      CommonSwal(theme, {
        icon: 'error',
        title: err?.response?.data || 'Something went wrong while saving vendor!',
        confirmButtonText: 'OK'
      })

      return null
    } finally {
      setSavingForm(false)
    }
  }

  const existingDocs = singleVendorData?.files?.filter(f => f.refType === 'VendorDocument') || []
  const existingCerts = singleVendorData?.files?.filter(f => f.refType === 'VendorCertificate') || []

  const [selectedCertificateId, setSelectedCertificateId] = useState(null)
  const [deleteCertificateId, setDeleteCertificateId] = useState(null)
  const [certificateLoading, setCertificateLoading] = useState(false)
  const [certificateDownloading, setCertificateDownloading] = useState(false)
  const [certificateFile, setCertificateFile] = useState(null)
  const [certificateType, setCertificateType] = useState('image')

  const handleOpenCertificateViewer = row => {
    setSelectedCertificateId(row.fileId)
    setCertificateLoading(true)
    getBase64StringFromFileId(row.fileId)
      .then(response => {
        const fileNameArray = row.name.split('.')
        const ext = fileNameArray[fileNameArray.length - 1].toLowerCase()
        setCertificateType(ext)

        if (ext === 'xlsx') {
          // Handle XLSX with Blob
          const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const byteCharacters = atob(response.data)
          const byteArrays = []

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }

            byteArrays.push(new Uint8Array(byteNumbers))
          }

          const blob = new Blob(byteArrays, { type: mimeType })
          setCertificateFile(blob)
        } else {
          // Handle other types using base64 string
          let mimeType = ''

          switch (ext) {
            case 'pdf':
              mimeType = 'application/pdf'
              break
            case 'txt':
              mimeType = 'text/plain'
              break
            case 'xls':
              mimeType = 'application/vnd.ms-excel'
              break
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
              mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`
              break
            default:
              mimeType = 'application/octet-stream'
          }

          const base64String = `data:${mimeType};base64,${response.data}`
          setCertificateFile(base64String)
        }

        setCertificateLoading(false)
      })
      .catch(err => {
        console.log(err)
        toast.error('Error Previewing file')

        setCertificateLoading(false)
      })
  }

  const handleCancelCertificateModel = () => {
    setCertificateViewer(false)
    setCertificateFile(null)
    setCertificateType('')
    setSelectedCertificateId(null)
  }

  const DownloadFileFromFileId = row => {
    setCertificateDownloading(true)
    setSelectedCertificateId(row.fileId)
    getBase64StringFromFileId(row.fileId)
      .then(response => {
        const fileNameArray = row.name.split('.')
        const ext = fileNameArray[fileNameArray.length - 1].toLowerCase()
        setCertificateType(ext === 'pdf' ? 'pdf' : 'image')

        let downloadLink = document.createElement('a')
        document.body.appendChild(downloadLink)

        if (ext === 'xlsx') {
          const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const byteCharacters = atob(response.data)
          const byteArrays = []

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }

            byteArrays.push(new Uint8Array(byteNumbers))
          }

          const blob = new Blob(byteArrays, { type: mimeType })
          const url = URL.createObjectURL(blob)
          downloadLink.href = url
          downloadLink.download = row.name
          downloadLink.click()
          URL.revokeObjectURL(url)
        } else {
          let mimeType = ''

          switch (ext) {
            case 'pdf':
              mimeType = 'application/pdf'
              break
            case 'txt':
              mimeType = 'text/plain'
              break
            case 'xls':
              mimeType = 'application/vnd.ms-excel'
              break
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
              mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`
              break
            default:
              mimeType = 'application/octet-stream'
          }

          const base64String = `data:${mimeType};base64,${response.data}`
          downloadLink.href = base64String
          downloadLink.download = row.name
          downloadLink.click()
        }
        setCertificateDownloading(false)
        setSelectedCertificateId(null)
      })
      .catch(err => {
        setCertificateDownloading(false)
        setSelectedCertificateId(null)
        toast.error('Error downloading file')
      })
  }

  useEffect(() => {
    if (certificateFile) {
      setCertificateViewer(true)
    }
  }, [certificateFile])

  const deleteCertificate = id => {
    setDeleteCertificateId(id)
    CommonSwal(theme, {
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendor/deleteCertificationVendor/${id}`,
          'delete',
          null,
          {}
        )
          .then(res => {
            // Update the audits directly to reflect deletion in the UI
            getSingleVendor(vendorId, setSingleVendorData)

            CommonSwal(theme, {
              title: 'Deleted!',
              text: res?.data?.data?.msg || 'Your record has been deleted.',
              icon: 'success'
            })
            setDeleteCertificateId(null)
          })
          .catch(err => {
            console.error(err)
            CommonSwal(theme, {
              title: 'Error!',
              text: err?.response?.data || 'Something went wrong!.',
              icon: 'error',
              confirmButtonText: 'OK'
            })
            setDeleteCertificateId(null)
          })
      }
    })
  }

  const certificateColumns = useMemo(() => {
    return [
      {
        flex: 0.15,
        field: 'certificationId',
        headerName: 'Certificate Id',
        renderCell: ({ row }) => {
          return <Typography>{row?.metadata?.certificationId ? row.metadata.certificationId : '—'}</Typography>
        }
      },
      {
        flex: 0.15,
        field: 'certificationName',
        headerName: 'Certificate Name',
        renderCell: ({ row }) => {
          return <Typography>{row?.metadata?.certificationName ? row.metadata.certificationName : '—'}</Typography>
        }
      },
      {
        flex: 0.15,
        field: 'startDate',
        headerName: 'Start Date',
        renderCell: ({ row }) => {
          return <Typography>{row?.metadata?.startDate ? convertDateFormat(row.metadata.startDate) : '—'}</Typography>
        }
      },
      {
        flex: 0.15,
        field: 'expirationDate',
        headerName: 'Expiry Date',
        renderCell: ({ row }) => {
          return (
            <Typography>
              {row?.metadata?.expirationDate ? convertDateFormat(row.metadata.expirationDate) : '—'}
            </Typography>
          )
        }
      },
      {
        flex: 0.15,
        field: 'name',
        headerName: t('File Name'),
        renderCell: params => <TableTextTooltip value={params.value} colWidth={params.colDef.width} />
      },
      {
        flex: 0.15,
        field: 'action',
        headerName: t('Action'),
        renderCell: params => {
          return (
            <>
              <IconButton
                sx={{ color: 'blue' }}
                onClick={() => {
                  setCertificateFormType('edit')
                  setSingleCertificateData(params.row.metadata)
                  setOpenLinkCertificateModal(true)
                }}
              >
                <img src={withEnvPath('/images/icons/GreyEditIcon.svg')} alt='Edit Document' />
              </IconButton>
              {!['xls', 'xlsx', 'csv', 'docx'].some(ext => params.row.name?.toLowerCase().includes(ext)) && (
                <>
                  <IconButton onClick={() => handleOpenCertificateViewer(params.row)} sx={{ cursor: 'pointer' }}>
                    {certificateLoading && selectedCertificateId && selectedCertificateId === params.row.fileId ? (
                      <CircularProgress size='24px' sx={{ color: theme.palette.company.primary }} />
                    ) : (
                      <RemoveRedEyeOutlinedIcon
                        sx={{ color: theme.palette.company.primary }}
                        titleAccess='View Certificate'
                      />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => DownloadFileFromFileId(params.row)}
                    sx={{ cursor: 'pointer' }}
                    disabled={certificateLoading}
                  >
                    {certificateDownloading && selectedCertificateId && selectedCertificateId === params.row.fileId ? (
                      <CircularProgress size='24px' sx={{ color: theme.palette.company.primary }} />
                    ) : (
                      <FileDownloadOutlinedIcon
                        sx={{ color: theme.palette.company.primary }}
                        titleAccess='Download Certificate'
                      />
                    )}
                  </IconButton>
                  <IconButton onClick={() => deleteCertificate(params.row.metadata.id)}>
                    {deleteCertificateId && deleteCertificateId === params.row.id ? (
                      <CircularProgress size='24px' sx={{ color: theme.palette.company.primary }} />
                    ) : (
                      <img src={withEnvPath('/images/icons/GreyDeleteIcon.svg')} alt='Delete' />
                    )}
                  </IconButton>
                </>
              )}
            </>
          )
        }
      }
    ]
  }, [t])

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmitForVendor)}>
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
              {/* ----- Basic Fields ----- */}
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('name')}
                    type='text'
                    label='Name'
                    autoComplete='off'
                    value={singleVendorData.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.name?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('email')}
                    type='text'
                    label='Email'
                    autoComplete='off'
                    value={singleVendorData.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.email?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('moblieNumber')}
                    type='text'
                    label='Mobile Number'
                    autoComplete='off'
                    value={singleVendorData.moblieNumber}
                    onChange={e => handleChange('moblieNumber', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.moblieNumber?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('primaryContactPersonName')}
                    type='text'
                    label='Contact Person Name'
                    autoComplete='off'
                    value={singleVendorData.primaryContactPersonName}
                    onChange={e => handleChange('primaryContactPersonName', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.primaryContactPersonName?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('primaryContactPersonEmail')}
                    type='text'
                    label='Contact Person Email'
                    autoComplete='off'
                    value={singleVendorData.primaryContactPersonEmail}
                    onChange={e => handleChange('primaryContactPersonEmail', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.primaryContactPersonEmail?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <FormControl fullWidth>
                  <TextField
                    {...register('primaryContactPersonContactNumber')}
                    type='text'
                    label='Contact Person Mobile Number'
                    autoComplete='off'
                    value={singleVendorData.primaryContactPersonContactNumber}
                    onChange={e => handleChange('primaryContactPersonContactNumber', e.target.value)}
                  />
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.primaryContactPersonContactNumber?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* ----- Dropdowns ----- */}
              {[
                { name: 'critical', label: 'Critical', data: critical_dropdown },
                { name: 'status', label: 'Status', data: vendor_status_dropdown },
                { name: 'assessmentFrequency', label: 'Assessment Frequency', data: frequency_dropdown },
                { name: 'type', label: 'Vendor Type', data: vendorType_dropdown }
              ].map(({ name, label, data }) => (
                <Grid item xs={12} sm={6} lg={4} key={name}>
                  <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                      {...register(name)}
                      value={singleVendorData[name]}
                      label={label}
                      onChange={e => handleChange(name, e.target.value)}
                    >
                      {data.map(item => (
                        <MenuItem key={item.lookupId} value={item.lookupId}>
                          {item.lookupName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.[name]?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              ))}

              {/* ----- Service Mapping ----- */}
              <Grid item xs={12} md={6} lg={4}>
                <Box sx={{ background: theme.palette.company.lighttertiary }}>
                  <Box
                    sx={{
                      height: '56px',
                      border: '1px solid',
                      background: theme.palette.company.background,
                      borderColor: theme.palette.company.primary,
                      color: theme.palette.company.primary,
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setOpenServiceMappingDrawer(true)}
                  >
                    Select Service Mapping
                  </Box>
                  {serviceMappingName.length > 0 && (
                    <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {serviceMappingName.map(item => (
                        <Box
                          key={item}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            background: `${theme.palette.company.primary}20`,
                            padding: '5px 10px',
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
                            onClick={() => handleServiceChange(item)}
                          >
                            <ClearRoundedIcon
                              sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                            />
                          </Box>
                          <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <ServiceMappingDrawer
                  openServiceMappingDrawer={openServiceMappingDrawer}
                  setOpenServiceMappingDrawer={setOpenServiceMappingDrawer}
                  service_dropdown={service_dropdown}
                  serviceMappingName={serviceMappingName}
                  handleServiceChange={handleServiceChange}
                />
                <FormHelperText sx={{ color: 'error.main' }}>{serviceError}</FormHelperText>
              </Grid>

              {/* Attachments Section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <Button
                    component='label'
                    variant='outlined'
                    startIcon={<CloudUpload />}
                    sx={{
                      padding: '10px 20px',
                      width: 'fit-content',
                      height: '46px',
                      margin: '0px',
                      lineHeight: '18px'
                    }}
                  >
                    Upload Vendor Documents
                    <input hidden multiple type='file' onChange={e => handleFileChange(e, 'VendorDocument')} />
                  </Button>

                  {existingDocs && existingDocs.length > 0 && (
                    <Button
                      variant='outlined'
                      startIcon={<CloudUpload />}
                      sx={{
                        padding: '10px 20px',
                        width: 'fit-content',
                        height: '46px',
                        margin: '0px',
                        lineHeight: '18px'
                      }}
                      onClick={() => handleOpenDocumentGridModel(existingDocs)}
                    >
                      View Existing Attachments ({existingDocs.length})
                    </Button>
                  )}
                </Box>
                <Box sx={{ mt: '10px' }}>
                  {!documentUploaded && files && files.length > 0 && (
                    <>
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
                        Selected Venfor File:{' '}
                      </Typography>
                      {files?.map((file, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Typography variant='body1Bold' sx={{ color: theme.palette.company.primary }}>
                            {file.name}{' '}
                          </Typography>
                          <IconButton
                            onClick={() => handlePreviewFile(file, 'VendorDocument')}
                            sx={{ cursor: 'pointer' }}
                          >
                            <RemoveRedEyeIcon sx={{ cursor: 'pointer' }} titleAccess='View Vendor Document' />
                          </IconButton>
                          <IconButton onClick={() => handleRemoveFile(i, 'VendorDocument')} sx={{ cursor: 'pointer' }}>
                            <ClearRoundedIcon sx={{ cursor: 'pointer' }} titleAccess='Delete Vendor Document' />
                          </IconButton>
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* ----- File Viewers ----- */}
            {open && (
              <DocumentGrid
                open={open}
                handleCancelModel={handleCancelDocumentGridModel}
                documentsArray={documentsArray}
              />
            )}
            {openDocumentViewer && (
              <DocumentViewer
                open={openDocumentViewer}
                handleCancelModel={() => setDocumentViewer(false)}
                setOpen={setDocumentViewer}
                file={selectedFile}
                fileType={fileType}
              />
            )}

            <Grid item xs={12} sx={{ mt: { xs: '16px', md: '30px' } }}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  variant='outlined'
                  sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                  onClick={() => {
                    router.back()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={savingForm}
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
          </>
        )}
      </form>
      {!loading && (
        <>
          <Divider sx={{ my: { xs: '16px', md: '30px' } }} />
          <Box>
            <Box
              sx={{
                my: { xs: '16px', md: '20px' },
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0 ? 1 : 0.5
              }}
              onClick={() => {}}
            >
              <Typography
                variant='h4'
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                    setExpandCertificate(!expandCertificate)
                  }
                }}
              >
                Vendor Certificates
              </Typography>
              <Box>
                <Button
                  size='medium'
                  variant='outlined'
                  onClick={() => {
                    if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                      setSingleCertificateData({
                        fileId: 0,
                        certificationId: '',
                        startDate: currentDate,
                        startDate: currentDate,
                        expirationDate: currentDate,
                        certificationName: '',
                        vendorId: 0
                      })
                      setCertificateFormType('create')
                      setOpenLinkCertificateModal(true)
                    }
                  }}
                >
                  {t('Link Certificate')}
                </Button>
                <IconButton
                  sx={{ color: theme.palette.company.primary }}
                  onClick={() => {
                    if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                      setExpandCertificate(!expandCertificate)
                    }
                  }}
                >
                  <KeyboardArrowDownRoundedIcon titleAccess='Open accordian' />
                </IconButton>
              </Box>
            </Box>
            {expandCertificate && (
              <>
                <Box sx={{ width: '100%', overflow: 'auto' }} className={'scrollDiv'}>
                  <CommonTable
                    data={existingCerts}
                    key={'fileId'}
                    getRowId={row => row.fileId}
                    columns={certificateColumns}
                    page={certificatesPage}
                    toolbarExport={false}
                    onPageChange={newPage => setCertificatesPage(newPage)}
                    pageSize={certificatesPageSize}
                    onPageSizeChange={newPageSize => {
                      setCertificatesPageSize(newPageSize)
                      setCertificatesPage(0) // Reset to first certificatesPage when certificatesPage size changes
                    }}
                    exportFileName='Control Certificates'
                  />
                </Box>
              </>
            )}
            {singleCertificateData && (
              <LinkCertificateModal
                files={files}
                handleFormSubmitForVendor={handleFormSubmitForVendor}
                singleVendorData={singleVendorData}
                setSingleVendorData={setSingleVendorData}
                certificateFormType={certificateFormType}
                setCertificateFormType={setCertificateFormType}
                singleCertificateData={singleCertificateData}
                setSingleCertificateData={setSingleCertificateData}
                openLinkCertificateModal={openLinkCertificateModal}
                setOpenLinkCertificateModal={setOpenLinkCertificateModal}
                setDocumentUploaded={setDocumentUploaded}
                setFiles={setFiles}
              />
            )}
            {openCertificateViewer && (
              <DocumentViewer
                file={certificateFile}
                type={certificateType}
                open={openCertificateViewer}
                createObjectURL={false}
                handleCancelModel={handleCancelCertificateModel}
              ></DocumentViewer>
            )}
          </Box>
        </>
      )}
    </>
  )
}

export default VendorForm
