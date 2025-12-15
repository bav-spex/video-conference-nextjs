import React, { useEffect, useState, useMemo } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloudUpload from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { CommonSwal } from 'components/CommonSwal'
import CommonTable from 'components/CommonTable'
import VendorForm from 'components/forms/vendors/vendorForm'
import TableTextTooltip from 'components/TableTextTooltip'
import Topbar from 'components/Topbar'
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

const currentDate = moment().format('YYYY-MM-DD')

const PreQualificationForm = ({
  vendorId,
  steps,
  activeStep,
  setActiveStep,
  availableStep,
  setAvailableStep,
  vendorData,
  setVendorData
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [singleVendorData, setSingleVendorData] = useState(vendorData)
  const [savingForm, setSavingForm] = useState(false)

  const [critical_dropdown, set_critical_dropdown] = useState([])
  const [vendor_status_dropdown, set_vendor_status_dropdown] = useState([])
  const [frequency_dropdown, set_frequency_dropdown] = useState([])

  const [questionAnswerData, setQuestionAnswerData] = useState([])
  // question Table Pagination
  const [questionPageSize, setQuestionPageSize] = useState(10) // Default controls size
  const [questionPage, setQuestionsPage] = useState(0) // Default controls

  const [openAnswerModal, setOpenAnswerModal] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentAnswer, setCurrentAnswer] = useState('')

  const [currentQuestionType, setCurrentQuestionType] = useState('')
  const [currentOptions, setCurrentOptions] = useState([])
  const [selectedSingleOption, setSelectedSingleOption] = useState('')
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState([])

  const [addingQuestion, setAddingQuestion] = useState(false)
  const [addingAnswer, setAddingAnswer] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [questionType, setQuestionType] = useState('text')
  const [options, setOptions] = useState([])
  const [newAnswer, setNewAnswer] = useState('')
  const [openNewQuestionModal, setOpenNewQuestionModal] = useState(false)
  const [questionModalError, setQuestionModalError] = useState('')
  const [deleteQuestionAnswertId, setDeleteQuestionAnswerId] = useState()

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
  const [expandSRP, setExpandSRP] = useState(false)
  // Certificates Table Pagination
  const [certificatesPageSize, setCertificatesPageSize] = useState(10) // Default certificatesPage size
  const [certificatesPage, setCertificatesPage] = useState(0) // Default certificatesPage

  useEffect(() => {
    getFrequencyDropdown(set_frequency_dropdown)

    getCriticalDropdown(set_critical_dropdown)
    getVendorStatusDropdown(set_vendor_status_dropdown)
  }, [])

  useEffect(() => {
    if (vendorData) {
      setSingleVendorData(vendorData)
      setQuestionAnswerData(
        vendorData?.preQuestions?.filter(item => item.stage === '2' && item.question !== null) || []
      )
    }
  }, [vendorData])

  useEffect(() => {
    if (frequency_dropdown.length > 0 && critical_dropdown.length > 0 && vendor_status_dropdown.length > 0) {
      setLoading(false)
    }
  }, [vendor_status_dropdown, critical_dropdown, frequency_dropdown])

  const validationSchema = yup.object().shape({
    // name: yup.string().min(1, 'Must be at least 3 characters').required('This field is required'),
    // email: yup.string().email().required()
  })

  const columns = [
    {
      flex: 0.4,
      field: 'question',
      headerName: t('Question'),
      renderCell: ({ row }) => {
        return (
          <>
            <Typography>{row.question}</Typography>
          </>
        )
      },
      filterable: true
    },
    {
      flex: 0.3,
      field: 'answer',
      headerName: 'Answer',
      renderCell: ({ row }) => {
        let answer
        if (row.questionType === 'multipleChoice') {
          answer = row?.options
            ?.filter(item => row?.answer?.includes(item.optionId))
            ?.map(item => {
              if (row?.answer?.includes(item?.optionId)) {
                return item?.optionText
              } else {
                return
              }
            })
            ?.join(', ')
        } else if (row.questionType === 'singleChoice') {
          answer = row.options.find(item => row?.answer?.includes(item.optionId))?.optionText
        } else {
          answer = row.answer
        }

        return (
          <>
            <Box sx={{ width: '100&', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{answer || ''}</Typography>
              <IconButton
                onClick={() => {
                  if (row.questionType === 'singleChoice') {
                    setSelectedSingleOption(row.answer)
                  }
                  if (row.questionType === 'multipleChoice') {
                    setSelectedMultipleOptions(row?.answer?.split(',') || [])
                  }
                  setCurrentQuestionType(row.questionType)
                  setCurrentOptions(row.options || [])
                  setCurrentAnswer(row.answer)
                  setCurrentQuestionId(row.questionId)
                  setCurrentQuestion(row.question)
                  setOpenAnswerModal(true)
                }}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Box>
          </>
        )
      }
    },
    {
      flex: 0.2,
      field: 'action',
      headerName: t('Action'),
      renderCell: ({ row }) => {
        return (
          <>
            <IconButton
              sx={{ color: theme.palette.company.primary }}
              onClick={() => handleDeleteQuestion(row.questionId)}
            >
              {deleteQuestionAnswertId && deleteQuestionAnswertId === row.questionId ? (
                <CircularProgress size='22px' sx={{ color: theme.palette.company.primary }} />
              ) : (
                <img src={withEnvPath('/images/icons/GreyDeleteIcon.svg')} alt='Delete Question' />
              )}
            </IconButton>
          </>
        )
      },
      filterable: false
    }
  ]

  const handleAddNewQuestion = async () => {
    setAddingQuestion(true)
    // Validation rules
    if (!newQuestion.trim()) {
      setQuestionModalError('Please enter a question.')
      setAddingQuestion(false)

      return
    }

    if (
      (questionType === 'singleChoice' || questionType === 'multipleChoice') &&
      (options.length === 0 || options.some(o => !o.optionText.trim()))
    ) {
      setQuestionModalError('Please add valid options (no empty fields).')
      setAddingQuestion(false)

      return
    }

    try {
      // ✅ Ensure vendor is created
      let currentVendorId = vendorId
      if (!currentVendorId) {
        const requiredFields = [
          'name',
          'email',
          'moblieNumber',
          'primaryContactPersonName',
          'primaryContactPersonEmail',
          'primaryContactPersonContactNumber',
          'spocName',
          'spocEmail',
          'spocMobileNumber'
        ]
        const hasAllRequired = requiredFields.every(field => singleVendorData?.[field])

        if (!hasAllRequired) {
          setNewQuestion('')
          setNewAnswer('')
          setQuestionType('text')
          setOptions([])
          setQuestionModalError()
          setOpenNewQuestionModal(false)
          CommonSwal(theme, {
            title: 'Error!',
            text: 'Please fill all required fields for the vendor before adding a question.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          setAddingQuestion(false)

          return
        }

        // Create vendor in DB
        const res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendor/save`,
          'post',
          singleVendorData,
          {}
        )
        if (res?.data?.vendorId || res?.data?.data?.vendorId) {
          currentVendorId = res?.data?.vendorId || res?.data?.data?.vendorId
          localStorage.setItem('localVendorId', JSON.stringify(currentVendorId))
          setVendorData(prev => ({ ...prev, vendorId: currentVendorId }))
          CommonSwal(theme, {
            icon: 'success',
            title: res?.data?.data?.msg || 'Added successfully!',
            showConfirmButton: true
          })
        } else {
          CommonSwal(theme, {
            icon: 'error',
            title: err?.response?.data || 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          setAddingQuestion(false)

          return
        }
      }

      // ✅ Vendor confirmed — now add the question
      const newRow = {
        questionId: null,
        question: newQuestion,
        answer: questionType === 'text' ? newAnswer : '',
        answerId: null,
        stage: '2',
        questionType,
        ...(questionType === 'singleChoice' || questionType === 'multipleChoice' ? { options } : {})
      }

      const payload = {
        ...singleVendorData,
        preQuestions: [
          // 2️⃣ vendorData.preQuestions → only if it's an array
          ...(Array.isArray(vendorData?.preQuestions)
            ? vendorData.preQuestions.filter(item => item.stage === '1')
            : []),

          // 3️⃣ questionAnswerData → map transformation
          ...(Array.isArray(questionAnswerData)
            ? questionAnswerData.map(item =>
                String(item.questionId).startsWith('temp') ? { ...item, questionId: null } : item
              )
            : []),
          newRow
        ]
      }

      await apiHelper(
        `${authConfig.complianceDevRakshitah_base_url}vendor/update/${currentVendorId}`,
        'put',
        payload,
        {}
      )

      await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/${currentVendorId}`, 'get', null, {})
        .then(response => {
          setVendorData(response.data)
          setSingleVendorData(response.data)
          setQuestionAnswerData(
            response.data?.preQuestions?.filter(item => item.stage === '2' && item.question !== null) || []
          )
          reset({
            ...response.data
          })
          setAddingQuestion(false)
        })
        .catch(err => {
          setAddingQuestion(false)
        })

      setNewQuestion('')
      setNewAnswer('')
      setQuestionType('text')
      setOptions([])
      setQuestionModalError()
      setOpenNewQuestionModal(false)
    } catch (err) {
      console.error(err)
      setAddingQuestion(false)
    }
  }

  const handleAnswerChange = async () => {
    try {
      setAddingAnswer(true)
      // 🧩 Ensure vendor is created before allowing answer update
      let currentVendorId = singleVendorData?.vendorId || vendorId

      if (!currentVendorId) {
        // Define which vendor fields are mandatory before question/answer interaction
        const requiredFields = [
          'name',
          'email',
          'moblieNumber',
          'primaryContactPersonName',
          'primaryContactPersonEmail',
          'primaryContactPersonContactNumber',
          'spocName',
          'spocEmail',
          'spocMobileNumber'
        ]

        const hasAllRequired = requiredFields.every(field => singleVendorData?.[field]?.trim?.())

        if (!hasAllRequired) {
          setCurrentAnswer('')
          setSelectedSingleOption('')
          setSelectedMultipleOptions([])
          setCurrentQuestionId()
          setCurrentQuestion()
          setCurrentOptions([])
          setCurrentQuestionType()
          setOpenAnswerModal(false)
          CommonSwal(theme, {
            icon: 'error',
            title: 'Please fill all required vendor fields before adding or updating an answer.'
          })
          setAddingAnswer(false)

          return
        }

        // ✅ Create vendor first
        const res = await apiHelper(
          `${authConfig.complianceDevRakshitah_base_url}vendor/save`,
          'post',
          singleVendorData,
          {}
        )
        if (res?.data?.vendorId || res?.data?.data?.vendorId) {
          currentVendorId = res?.data?.vendorId || res?.data?.data?.vendorId
          localStorage.setItem('localVendorId', JSON.stringify(currentVendorId))
          setVendorData(prev => ({ ...prev, vendorId: currentVendorId }))
          CommonSwal(theme, {
            icon: 'success',
            title: res?.data?.data?.msg || 'Added successfully!',
            showConfirmButton: true
          })
        } else {
          CommonSwal(theme, {
            icon: 'error',
            title: err?.response?.data || 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          setAddingAnswer(false)

          return
        }
      }

      // ✅ Vendor confirmed — proceed with answer update
      let updatedAnswer = currentAnswer

      if (currentQuestionType === 'singleChoice') {
        updatedAnswer = selectedSingleOption
      }

      if (currentQuestionType === 'multipleChoice') {
        updatedAnswer = selectedMultipleOptions.join(',')
      }

      const updatedRows = questionAnswerData.map(row =>
        row.questionId === currentQuestionId ? { ...row, answer: updatedAnswer } : row
      )

      const payload = {
        ...singleVendorData,
        preQuestions: [
          // 2️⃣ vendorData.preQuestions → only if it's an array
          ...(Array.isArray(vendorData?.preQuestions)
            ? vendorData.preQuestions.filter(item => item.stage === '1')
            : []),

          // 3️⃣ questionAnswerData → map transformation
          ...(Array.isArray(updatedRows)
            ? updatedRows.map(item =>
                String(item.questionId).startsWith('temp') ? { ...item, questionId: null } : item
              )
            : [])
        ]
      }

      await apiHelper(
        `${authConfig.complianceDevRakshitah_base_url}vendor/update/${currentVendorId}`,
        'put',
        payload,
        {}
      )

      await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/${currentVendorId}`, 'get', null, {})
        .then(response => {
          setVendorData(response.data)
          setSingleVendorData(response.data)
          setQuestionAnswerData(
            response.data?.preQuestions?.filter(item => item.stage === '2' && item.question !== null) || []
          )
          reset({
            ...response.data
          })
          setAddingAnswer(false)
        })
        .catch(err => {
          setAddingAnswer(false)
        })

      // reset modal states
      setOpenAnswerModal(false)
      setCurrentAnswer('')
      setSelectedSingleOption('')
      setSelectedMultipleOptions([])
      setCurrentQuestionId()
      setCurrentQuestion('')
      setCurrentOptions([])
      setCurrentQuestionType('')
    } catch (error) {
      setAddingAnswer(false)
      console.error('Error while updating answer:', error)
      CommonSwal(theme, {
        icon: 'error',
        title: 'Something went wrong while updating the answer.'
      })
    }
  }

  const handleDeleteQuestion = id => {
    CommonSwal(theme, {
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        setDeleteQuestionAnswerId(id)
        if (String(id).startsWith('temp')) {
          setQuestionAnswerData(prev => prev.filter(q => q.questionId !== id))
          CommonSwal(theme, {
            title: 'Deleted!',
            text: 'Temporary question removed.',
            icon: 'success'
          })
          setDeleteQuestionAnswerId(null)
        } else {
          apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/pre-questions//${id}`, 'delete', null, {})
            .then(res => {
              setQuestionAnswerData(prev => prev.filter(q => q.questionId !== id))
              setDeleteQuestionAnswerId(null)
              CommonSwal(theme, {
                title: 'Deleted!',
                text: res?.response?.data || 'Your record has been deleted!',
                icon: 'success'
              })
            })
            .catch(err => {
              console.log(err)
              setDeleteQuestionAnswerId(null)
              CommonSwal(theme, {
                title: 'Error!',
                text: err?.response?.data || 'Your record has not been deleted!',
                icon: 'error',
                confirmButtonText: 'OK'
              })
            })
        }
      }
    })
  }

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

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
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
      critical: singleVendorData.critical ?? 0,
      status: singleVendorData.status ?? 0,
      assessmentFrequency: singleVendorData.assessmentFrequency ?? 0,
      preQuestions: [
        // 2️⃣ vendorData.preQuestions → only if it's an array
        ...(Array.isArray(vendorData?.preQuestions) ? vendorData.preQuestions.filter(item => item.stage === '1') : []),

        // 3️⃣ questionAnswerData → map transformation
        ...(Array.isArray(questionAnswerData)
          ? questionAnswerData.map(item =>
              String(item.questionId).startsWith('temp') ? { ...item, questionId: null } : item
            )
          : [])
      ]
    }

    const vendorId = await onSubmit(payload, uploadFileHandle)

    return vendorId
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    let finalVendorId = vendorData.vendorId || null
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
        await getSingleVendor(vendorId, setVendorData)

        // CommonSwal(theme, {
        //   icon: 'success',
        //   title: res?.data?.data?.msg || 'Vendor updated successfully!',
        //   showConfirmButton: true
        // })
        router.push({
          pathname: `/home/thirdparty/vendorWizard/vendorAssessment/${vendorId}`,
          query: { activeStep: 2, availableStep: 2 }
        })
        // setActiveStep(2)
        // setAvailableStep(2)
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
      .catch(() => {
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
                        titleAccess='View Evidence'
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
      <Topbar hardMenuName='Third Party' hardSubmenuName='Add Vendor'>
        <Button variant='primary' onClick={() => router.back()}>
          Back
        </Button>
      </Topbar>
      <Box className={'tableBlock scrollDiv'}>
        <Box sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(item => (
                <Step
                  key={item.stepNumber}
                  onClick={() => {
                    if (availableStep >= item.stepNumber) {
                      if (item.stepNumber === 2) {
                        router.push({
                          pathname: `/home/thirdparty/vendorWizard/vendorAssessment/${vendorId}`,
                          query: { activeStep: 2, availableStep: 2 }
                        })
                      } else {
                        setActiveStep(item.stepNumber)
                      }
                    }
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <StepLabel
                    sx={{
                      '& .MuiStepIcon-root': {
                        color: activeStep === item.stepNumber ? 'red' : theme.palette.company.grey // this changes the circle color
                      },
                      '& .Mui-active .MuiStepIcon-root': {
                        color: theme.palette.company.lightprimary // active step
                      },
                      '& .Mui-completed .MuiStepIcon-root': {
                        color: theme.palette.company.secondary // completed step
                      }
                    }}
                  >
                    {item.title}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>{' '}
          <Box
            backgroundColor={'#ffffff'}
            p={{ xs: '16px', md: '30px' }}
            mt={'20px'}
            boxShadow={'0px 2px 10px 0px rgba(58, 53, 65, 0.1)'}
            borderRadius={'6px'}
          >
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

                    {/* ----- Dropdowns ----- */}
                    {[
                      { name: 'critical', label: 'Critical', data: critical_dropdown },
                      { name: 'status', label: 'Status', data: vendor_status_dropdown },
                      { name: 'assessmentFrequency', label: 'Assessment Frequency', data: frequency_dropdown }
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
                                <IconButton
                                  onClick={() => handleRemoveFile(i, 'VendorDocument')}
                                  sx={{ cursor: 'pointer' }}
                                >
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
                          setActiveStep(0)
                        }}
                      >
                        Back
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
                          t('Next')
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
                      opacity: 1
                    }}
                    onClick={() => {}}
                  >
                    <Typography
                      variant='h4'
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        // if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                        setExpandSRP(!expandSRP)
                        // }
                      }}
                    >
                      Pre Qualification Information
                    </Typography>
                    <Box>
                      <IconButton
                        sx={{ color: theme.palette.company.primary }}
                        onClick={() => {
                          //   if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                          setExpandSRP(!expandSRP)
                          //   }
                        }}
                      >
                        {expandSRP ? (
                          <KeyboardArrowUpRoundedIcon titleAccess='Close SRP' />
                        ) : (
                          <KeyboardArrowDownRoundedIcon titleAccess='Open SRP' />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                  {expandSRP && (
                    <>
                      <Box
                        sx={{
                          my: { xs: '16px', md: '20px' },
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: 1
                        }}
                        onClick={() => {}}
                      >
                        <Typography variant='h4' sx={{ cursor: 'pointer' }}>
                          Vendor Certificates
                        </Typography>
                        <Button
                          size='medium'
                          variant='outlined'
                          onClick={() => {
                            //   if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
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
                            //   }
                          }}
                        >
                          {t('Link Certificate')}
                        </Button>
                      </Box>
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
                      <Divider sx={{}} />
                      <Box
                        sx={{
                          p: { xs: '10px 0px', md: '10px 0px' },
                          mt: { xs: '16px', md: '30px' },
                          display: 'flex',
                          justifyContent: 'space-between',
                          background: theme.palette.company.background
                        }}
                      >
                        {' '}
                        <Typography
                          variant='h4'
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            // if (singleVendorData.name.length > 0 && isValidEmail(singleVendorData.email) > 0) {
                            setExpandSRP(!expandSRP)
                            // }
                          }}
                        >
                          Questions
                        </Typography>
                        <Button variant='secondary' onClick={() => setOpenNewQuestionModal(true)}>
                          Add Question
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          overflowX: 'hidden',
                          width: '100%',
                          overflowX: 'auto',
                          minHeight: '400px',
                          height: '600px',
                          maxHeight: '900px',
                          paddingBottom: '50px'
                        }}
                        className={'scrollDiv'}
                      >
                        <DataGrid
                          components={{
                            Toolbar: '' // ✅ adds search + filter + density options
                          }}
                          rows={questionAnswerData}
                          getRowId={row => row.questionId}
                          columns={columns}
                          pagination
                          page={questionPage}
                          onPageChange={newPage => setQuestionsPage(newPage)}
                          pageSize={questionPageSize}
                          onPageSizeChange={newPageSize => {
                            setQuestionPageSize(newPageSize)
                            setQuestionsPage(0) // Reset to first questionPage when questionPage size changes
                          }}
                          rowsPerPageOptions={[10, 25, 50, 100]}
                          componentsProps={{
                            columnMenu: {
                              sx: {
                                '& .MuiMenuItem-root': {
                                  color: theme.palette.company.text,
                                  background: theme.palette.company.background,
                                  borderRadius: '5px',
                                  '&:hover': {
                                    color: theme.palette.company.primary,
                                    background: theme.palette.company.tertiary
                                  },
                                  '&.Mui-disabled': {
                                    color: theme.palette.company.primary,
                                    background: theme.palette.company.tertiary,
                                    border: '1px solid',
                                    borderColor: theme.palette.company.primary
                                  }
                                }
                              }
                            }
                          }}
                          sx={{
                            minWidth: 900,
                            border: 'none',
                            '& .MuiDataGrid-cell:first-of-type': {
                              pl: { xs: '16px', md: '30px' } // padding-left
                            },
                            // last column cells
                            '& .MuiDataGrid-cell:last-of-type': {
                              pr: { xs: '16px', md: '30px' } // padding-right
                            },
                            // also apply to headers
                            '& .MuiDataGrid-columnHeader:first-of-type': {
                              pl: { xs: '16px', md: '30px' }
                            },
                            '& .MuiDataGrid-columnHeader:last-of-type': {
                              pr: { xs: '16px', md: '30px' }
                            },
                            // Header
                            '& .MuiDataGrid-columnHeaders': {
                              borderRadius: '0px !important',
                              height: 50,
                              backgroundColor: theme.palette.company.tableHeaderBackground,
                              color: theme.palette.company.text,
                              outline: 'none',
                              lineHeight: '50px'
                            },
                            '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnSeparator': {
                              height: 50
                            },
                            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                              outline: 'none'
                            },

                            // Header Title
                            '& .MuiDataGrid-columnHeaderTitle': {
                              whiteSpace: 'normal',
                              lineHeight: '1.4',
                              fontWeight: 600,
                              fontSize: 14
                            },

                            // Rows
                            '& .MuiDataGrid-row': {
                              minHeight: 'fit-content !important',
                              maxHeight: '100% !important',
                              cursor: 'pointer',
                              '&:nth-of-type(odd)': {
                                backgroundColor: '#FAF9FB'
                              },
                              '&:hover': {
                                backgroundColor: theme.palette.company.tertiary
                              }
                            },
                            '& .MuiDataGrid-cell': {
                              whiteSpace: 'normal !important',
                              minHeight: 'fit-content !important',
                              maxHeight: '100% !important',
                              backgroundColor: '#F9FAFC',
                              padding: '8px 12px',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              wordBreak: 'break-all'
                            },
                            '& .MuiDataGrid-cell:focus-within': {
                              outline: 'none'
                            },

                            // Selected row
                            '& .MuiDataGrid-row.Mui-selected': {
                              backgroundColor: theme.palette.company.tertiary,
                              outline: 'none'
                            },

                            // Pagination
                            '& .MuiDataGrid-footerContainer': {
                              borderRadius: '0px !important',
                              backgroundColor: theme.palette.company.tertiary,
                              padding: '8px 30px'
                            }
                          }}
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
                      setVendorData={setVendorData}
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
          </Box>
        </Box>
      </Box>
      {/* // Question Dialog`` */}
      <Dialog
        fullWidth
        maxWidth='sm'
        open={openNewQuestionModal}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
        }}
      >
        <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
          <Typography variant='h4'>Add New Question</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
          {questionModalError && (
            <Alert severity='error' sx={{ mb: '10px', width: '100%' }}>
              {questionModalError}
            </Alert>
          )}

          {/* Question */}
          <TextField
            fullWidth
            label='Question'
            variant='outlined'
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            sx={{ mb: 3, mt: '5px' }}
          />

          {/* Question Type */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Question Type</InputLabel>
            <Select value={questionType} label='Question Type' onChange={e => setQuestionType(e.target.value)}>
              <MenuItem value='text'>Text</MenuItem>
              <MenuItem value='singleChoice'>Single Choice</MenuItem>
              <MenuItem value='multipleChoice'>Multiple Choice</MenuItem>
            </Select>
          </FormControl>

          {/* Answer for Text */}
          {questionType === 'text' && (
            <TextField
              fullWidth
              multiline
              label='Answer'
              variant='outlined'
              rows={3}
              value={newAnswer}
              onChange={e => setNewAnswer(e.target.value)}
            />
          )}

          {/* Options for Single/Multiple Choice */}
          {(questionType === 'singleChoice' || questionType === 'multipleChoice') && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle1' sx={{ mb: '10px' }}>
                Options
              </Typography>
              {options.map((opt, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '10px' }}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={opt.optionText}
                    onChange={e => {
                      const updated = [...options]
                      updated[index].optionText = e.target.value
                      setOptions(updated)
                    }}
                  />
                  <IconButton color='error' onClick={() => setOptions(options.filter((_, i) => i !== index))}>
                    <img src={withEnvPath('/images/icons/GreyDeleteIcon.svg')} alt='Delete Question' />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant='outlined'
                sx={{ m: '0px' }}
                onClick={() => setOptions(prev => [...prev, { optionId: null, optionText: '' }])}
              >
                + Add Option
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: '10px', sm: '20px' } }}>
          <Button
            variant='outlined'
            sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            onClick={() => {
              setNewQuestion('')
              setNewAnswer('')
              setQuestionType('text')
              setOptions([])
              setQuestionModalError()
              setOpenNewQuestionModal(false)
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={addingQuestion}
            variant='secondary'
            sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
            onClick={async () => {
              handleAddNewQuestion()
            }}
          >
            {addingQuestion ? <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* // Answer Dialog`` */}
      <Dialog
        fullWidth
        maxWidth='sm'
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
        }}
        open={openAnswerModal}
      >
        <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
          <Typography variant='h4'>Answer</Typography>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
          <Box sx={{ display: 'flex', mb: '10px' }}>
            <Typography variant='body1Bold' sx={{ width: '100px' }}>
              Question:
            </Typography>
            <Typography>{currentQuestion + '?'}</Typography>
          </Box>

          {/* Conditional Rendering Based on Question Type */}
          {currentQuestionType === 'text' && (
            <Box sx={{ height: '100px', display: 'flex' }}>
              <Typography variant='body1Bold' sx={{ minWidth: '100px !important' }}>
                Answer:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                type='textarea'
                sx={{ border: '0px' }}
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                size='small'
              />
            </Box>
          )}

          {currentQuestionType === 'singleChoice' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='body1Bold' sx={{ mb: 1 }}>
                Select one option:
              </Typography>
              <RadioGroup value={selectedSingleOption} onChange={e => setSelectedSingleOption(e.target.value)}>
                {currentOptions?.map(opt => (
                  <Box key={opt.optionId}>
                    <FormControlLabel value={String(opt.optionId)} control={<Radio />} label={opt.optionText} />
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          )}

          {currentQuestionType === 'multipleChoice' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='body1Bold' sx={{ mb: 1 }}>
                Select one or more options:
              </Typography>
              {currentOptions?.map(opt => (
                <Box key={opt.optionId}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMultipleOptions.includes(String(opt.optionId))}
                        onChange={e => {
                          const value = String(opt.optionId)
                          if (e.target.checked) {
                            setSelectedMultipleOptions(prev => [...prev, value])
                          } else {
                            setSelectedMultipleOptions(prev => prev.filter(v => v !== value))
                          }
                        }}
                      />
                    }
                    label={opt.optionText}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: '10px', sm: '20px' } }}>
          <Button
            variant='outlined'
            sx={{
              padding: '10px 30px',
              width: '100px',
              height: '46px',
              margin: '0px'
            }}
            onClick={() => {
              setCurrentAnswer('')
              setSelectedSingleOption('')
              setSelectedMultipleOptions([])
              setCurrentQuestionId()
              setCurrentQuestion()
              setCurrentOptions([])
              setCurrentQuestionType()
              setOpenAnswerModal(false)
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={addingAnswer}
            type='submit'
            variant='secondary'
            sx={{
              padding: '10px 30px',
              width: '100px',
              height: '46px',
              margin: '0px'
            }}
            onClick={handleAnswerChange}
          >
            {addingAnswer ? (
              <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
            ) : (
              'Submit'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PreQualificationForm
