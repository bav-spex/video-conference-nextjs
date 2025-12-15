import React, { useEffect, useMemo, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import EditIcon from '@mui/icons-material/Edit'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
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
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { CommonSwal } from 'components/CommonSwal'
import Topbar from 'components/Topbar'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getServiceDropdown, getVendorCategoryDropdown, getVendorTypeDropdown } from 'services/common'
import { getSingleVendor, getVendorPreQuestions } from 'services/thirdparty/vendorWizard/vendorWizardServices'
import apiHelper from 'store/apiHelper'
import { withEnvPath } from 'utils/misc'
import * as yup from 'yup'

import ServiceMappingDrawer from './serviceMappingDrawer'

const ServiceProfileForm = ({
  formType,
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

  const [category_dropdown, set_category_dropdown] = useState([])
  const [vendorType_dropdown, set_vendorType_dropdown] = useState([])

  const [basicQuestionAnswer, setBasicQuestionAnswer] = useState()
  const [questionAnswerData, setQuestionAnswerData] = useState([])
  // question Table Pagination
  const [questionPageSize, setQuestionPageSize] = useState(10) // Default controls size
  const [questionPage, setQuestionsPage] = useState(0) // Default controls
  const [expandSRP, setExpandSRP] = useState(false)

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

  const [service_dropdown, set_service_dropdown] = useState([])
  const [serviceMappingName, setServiceMappingName] = useState([])
  const [serviceDropdownIds, setServiceDropdownIds] = useState([])
  const [serviceError, setServiceError] = useState()
  const [openServiceMappingDrawer, setOpenServiceMappingDrawer] = useState(false)

  useEffect(() => {
    if (vendorData) {
      setSingleVendorData(vendorData)
      reset({
        ...vendorData
      })
      setQuestionAnswerData(
        vendorData?.preQuestions?.filter(item => item.stage === '1' && item.question !== null) || []
      )
    }
  }, [vendorData, activeStep])

  useEffect(() => {
    getVendorCategoryDropdown(set_category_dropdown)
    getVendorTypeDropdown(set_vendorType_dropdown)
    getServiceDropdown(set_service_dropdown)
    if (formType === 'create' && availableStep === 0) {
      getVendorPreQuestions(setBasicQuestionAnswer)
    }
  }, [])

  useEffect(() => {
    if (basicQuestionAnswer && basicQuestionAnswer.length > 0 && availableStep === 0) {
      setQuestionAnswerData([
        ...basicQuestionAnswer.filter(item => item.stage === '1' && item.question !== null),
        ...questionAnswerData
      ])
    }
  }, [basicQuestionAnswer])

  useEffect(() => {
    if (service_dropdown.length > 0 && category_dropdown.length > 0 && vendorType_dropdown.length > 0) {
      if (formType === 'create' && basicQuestionAnswer) {
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
  }, [basicQuestionAnswer, category_dropdown, formType, service_dropdown.length, vendorType_dropdown])

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
    email: yup.string().email().required(),
    moblieNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('This field is required'),
    primaryContactPersonName: yup.string().min(1, 'Must be at least 3 characters').required('This field is required'),
    primaryContactPersonEmail: yup.string().email().required(),
    primaryContactPersonContactNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('This field is required'),
    spocName: yup.string().min(1, 'Must be at least 3 characters').required('This field is required'),
    spocEmail: yup.string().email().required(),
    spocMobileNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('This field is required')
  })

  const handleChange = (name, value) => {
    setSingleVendorData(prev => ({ ...prev, [name]: value }))
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
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    register,
    reset
  } = useForm({ resolver: yupResolver(validationSchema), mode: 'onSubmit' })

  const criticalFlag = watch('isCritical')

  const handleFormSubmitForVendor = async values => {
    const payload = {
      ...singleVendorData,
      name: values.name?.trim(),
      email: values.email?.trim(),
      moblieNumber: values.moblieNumber?.trim() ?? '',
      primaryContactPersonName: values.primaryContactPersonName?.trim(),
      primaryContactPersonEmail: values.primaryContactPersonEmail?.trim(),
      primaryContactPersonContactNumber: values.primaryContactPersonContactNumber?.trim() ?? '',
      spocName: values.spocName?.trim(),
      spocEmail: values.spocEmail?.trim(),
      spocMobileNumber: values.spocMobileNumber?.trim() ?? '',
      category: values.category ?? 0,
      type: values.type ?? 0,
      isCritical: values.isCritical ?? 0,
      services: serviceDropdownIds ?? [],
      preQuestions: [
        // 1️⃣ basicQuestionAnswer → only if it's an array
        ...(Array.isArray(basicQuestionAnswer) ? basicQuestionAnswer.filter(item => item.stage === '2') : []),

        // 2️⃣ vendorData.preQuestions → only if it's an array
        ...(Array.isArray(vendorData?.preQuestions) ? vendorData.preQuestions.filter(item => item.stage === '2') : []),

        // 3️⃣ questionAnswerData → map transformation
        ...(Array.isArray(questionAnswerData)
          ? questionAnswerData.map(item =>
              String(item.questionId).startsWith('temp') ? { ...item, questionId: null } : item
            )
          : [])
      ]
    }

    const vendorId = await onSubmit(payload)

    return vendorId
  }

  const onSubmit = async payload => {
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

        await getSingleVendor(vendorId, setVendorData)
        // CommonSwal(theme, {
        //   icon: 'success',
        //   title: res?.data?.data?.msg || 'Vendor updated successfully!',
        //   showConfirmButton: true
        // })
      } else {
        // ✅ Create new vendor
        res = await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/save`, 'post', payload, {})
        const newId = res?.data?.vendorId || res?.data?.data?.vendorId
        finalVendorId = newId

        setSingleVendorData(prev => ({ ...prev, vendorId: newId }))

        // CommonSwal(theme, {
        //   icon: 'success',
        //   title: res?.data?.data?.msg || 'Vendor added successfully!',
        //   showConfirmButton: true
        // })
      }
      await getSingleVendor(finalVendorId, setVendorData)
      localStorage.setItem('localVendorId', JSON.stringify(finalVendorId))

      if (process.env.NEXT_PUBLIC_VENDOR_CRITICAL_FUNCTIONALITY === 'true') {
        if (payload.isCritical) {
          setActiveStep(1)
          setAvailableStep(1)
        } else {
          router.push('/home/thirdparty/vendorWizard')
        }
      } else {
        setActiveStep(1)
        setAvailableStep(1)
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
        stage: '1',
        questionType,
        ...(questionType === 'singleChoice' || questionType === 'multipleChoice' ? { options } : {})
      }

      const payload = {
        ...singleVendorData,
        preQuestions: [
          // 1️⃣ basicQuestionAnswer → only if it's an array
          ...(Array.isArray(basicQuestionAnswer) ? basicQuestionAnswer.filter(item => item.stage === '2') : []),

          // 2️⃣ vendorData.preQuestions → only if it's an array
          ...(Array.isArray(vendorData?.preQuestions)
            ? vendorData.preQuestions.filter(item => item.stage === '2')
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
            response.data?.preQuestions?.filter(item => item.stage === '1' && item.question !== null) || []
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
          // 1️⃣ basicQuestionAnswer → only if it's an array
          ...(Array.isArray(basicQuestionAnswer) ? basicQuestionAnswer.filter(item => item.stage === '2') : []),

          // 2️⃣ vendorData.preQuestions → only if it's an array
          ...(Array.isArray(vendorData?.preQuestions)
            ? vendorData.preQuestions.filter(item => item.stage === '2')
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
            response.data?.preQuestions?.filter(item => item.stage === '1' && item.question !== null) || []
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
          apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/pre-questions/${id}`, 'delete', null, {})
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

  return (
    <>
      <Topbar hardMenuName='Third Party' hardSubmenuName='Add Vendor'>
        <Button variant='primary' onClick={() => router.back()}>
          Back
        </Button>
      </Topbar>
      <form onSubmit={handleSubmit(handleFormSubmitForVendor)}>
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
            </Box>
            <Box
              backgroundColor={'#ffffff'}
              p={{ xs: '16px', md: '30px' }}
              mt={'20px'}
              boxShadow={'0px 2px 10px 0px rgba(58, 53, 65, 0.1)'}
              borderRadius={'6px'}
            >
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
                          label='Name *'
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
                          label='Email *'
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
                          label='Mobile Number *'
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
                          label='Contact Person Name *'
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
                          label='Contact Person Email *'
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
                          label='Contact Person Mobile Number *'
                          autoComplete='off'
                          value={singleVendorData.primaryContactPersonContactNumber}
                          onChange={e => handleChange('primaryContactPersonContactNumber', e.target.value)}
                        />
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors?.primaryContactPersonContactNumber?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormControl fullWidth>
                        <TextField
                          {...register('spocName')}
                          type='text'
                          label='SPOC Name *'
                          autoComplete='off'
                          value={singleVendorData.spocName}
                          onChange={e => handleChange('spocName', e.target.value)}
                        />
                        <FormHelperText sx={{ color: 'error.main' }}>{errors?.spocName?.message}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormControl fullWidth>
                        <TextField
                          {...register('spocEmail')}
                          type='text'
                          label='SPOC Email *'
                          autoComplete='off'
                          value={singleVendorData.spocEmail}
                          onChange={e => handleChange('spocEmail', e.target.value)}
                        />
                        <FormHelperText sx={{ color: 'error.main' }}>{errors?.spocEmail?.message}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormControl fullWidth>
                        <TextField
                          {...register('spocMobileNumber')}
                          type='text'
                          label='SPOC Mobile Number *'
                          autoComplete='off'
                          value={singleVendorData.spocMobileNumber}
                          onChange={e => handleChange('spocMobileNumber', e.target.value)}
                        />
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors?.spocMobileNumber?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* ----- Dropdowns ----- */}
                    {[
                      { name: 'category', label: 'Category', data: category_dropdown },
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
                  </Grid>

                  <Grid item xs={12} sx={{ mt: { xs: '16px', md: '30px' } }}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Button
                        variant='outlined'
                        sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                        onClick={() => {
                          router.back()
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
                        ) : process.env.NEXT_PUBLIC_VENDOR_CRITICAL_FUNCTIONALITY === 'true' ? (
                          criticalFlag ? (
                            'Next'
                          ) : (
                            'Save'
                          )
                        ) : (
                          'Next'
                        )}
                      </Button>
                    </Box>
                  </Grid>
                  <Divider sx={{ my: { xs: '16px', md: '30px' } }} />
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
                      SRP
                    </Typography>

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
                  <Box>
                    {expandSRP && (
                      <>
                        {/* Is Critical */}
                        <Grid container spacing={{ xs: 4, md: 7.25 }} sx={{ my: '16px' }}>
                          <Grid item xs={12} sm={6} lg={6}>
                            <Box
                              sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                              }}
                            >
                              <Typography variant='h5'>{t('Is Critical')}</Typography>
                              <Controller
                                name='isCritical'
                                control={control}
                                checked={singleVendorData.isCritical}
                                onChange={e => handleChange('isCritical', e.target.value)}
                                render={({ field }) => (
                                  <Checkbox {...field} checked={field.value} disabled={formType === 'view'} />
                                )}
                              />
                            </Box>
                          </Grid>
                          {/* ----- Service Mapping ----- */}
                          <Grid item xs={12} md={6} lg={6}>
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
                        </Grid>

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
                            Questions
                          </Typography>
                          <Button variant='secondary' onClick={() => setOpenNewQuestionModal(true)}>
                            Add Question
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            mt: '10px',
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
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </form>
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
                    key={opt.optionId}
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

export default ServiceProfileForm
