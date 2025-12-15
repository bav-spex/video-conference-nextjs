import React, { useEffect, useMemo, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloudUpload from '@mui/icons-material/CloudUpload'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonLinkDrawer from 'components/CommonLinkDrawer'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getAdditionlStakeHoldersDropDown,
  getTeamDropDown,
  getControlDropDown,
  getStrategyDropDown,
  getEffortsDropDown,
  getCurrentLikelyHoodDropDown,
  getCurrentImpactDropDown,
  getVulnerabilityLevelDropdown,
  getPlannedControlRatingDropdown,
  getImplementationStatusDropdown,
  uploadFile
} from 'services/common'
import { getSingleRisk } from 'services/Risks/RiskService'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'
import * as yup from 'yup'

import DocumentGrid from '../documentGrid'
import DocumentViewer from '../documentViewer'
import TeamPopper from './TeamPopper'

const RiskMitigationForm = ({ formType, mitigationData, riskId, setActiveStep, availableStep, setAvailableStep }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [file, setFile] = useState()
  const [type, setType] = useState('')

  const currentDate = moment().format('YYYY-MM-DD')

  const [loading, setLoading] = useState(true)
  const [savingForm, setSavingForm] = useState(false)

  const [efforts_dropdown, set_efforts_dropdown] = useState([])
  const [planned_control_rating_dropdown, set_planned_control_rating_dropdown] = useState([])
  const [implementation_status_dropdown, set_implementation_status_dropdown] = useState([])
  const [vulnerability_level_dropdown, set_vulnerability_level_dropdown] = useState([])
  const [probability_of_occurance_dropdown, set_probability_of_occurance_dropdown] = useState([])
  const [impact_rating_dropdown, set_impact_rating_dropdown] = useState([])
  const [strategy_dropdown, set_strategy_dropdown] = useState([])
  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])

  const [team_dropdown, set_team_dropdown] = useState([])
  const [teamMappingName, setTeamMappingName] = useState([])
  const [teamDropdownIds, setTeamDropdownIds] = useState([])
  const [teamError, setTeamError] = useState()

  const [documentsArray, setDocumentsArray] = useState([])
  const [open, setOpen] = useState(false)
  const [openDocumentViewer, setDocumentViewer] = useState(false)

  const [control_dropdown, set_control_dropdown] = useState([])
  const [openControlModal, setOpenControlModal] = useState(false)
  const [selectedControls, setSelectedControls] = useState([])
  const [tempSelectedControls, setTempSelectedControls] = useState([])
  const [selectedControlsCode, setSelectedControlsCode] = useState([])

  // controls Table Pagination
  const [controlsPageSize, setControlsPageSize] = useState(100) // Default controls size
  const [controlsPage, setControlsPage] = useState(100) // Default controls

  const [singleMitigationData, setSingleMitigationData] = useState(mitigationData)

  const [singleRiskData, setSingleRiskData] = useState({})

  const [teamAnchorEl, setTeamAnchorEl] = useState(null)
  const [openTeamPopper, setOpenTeamPopper] = useState(false)

  useEffect(() => {
    if (mitigationData) {
      setSelectedControls([...mitigationData.mitigationcontrols])
      setTempSelectedControls([...mitigationData.mitigationcontrols])
      setSingleMitigationData(mitigationData)
    }
  }, [mitigationData])

  useEffect(() => {
    if (selectedControls && control_dropdown?.length > 0 && !loading) {
      const filtered = control_dropdown.filter(obj => selectedControls.includes(obj.id))
      setSelectedControlsCode(filtered.map(item => item['control-number']))
    }
  }, [mitigationData, control_dropdown, loading, selectedControls])

  const validationSchema = yup.object().shape({
    treatmentStrategy: yup.number().notOneOf([0], 'Treatment is required').required('Treatment is required'),
    plannedControl: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    plannedControlRating: yup
      .number()
      .notOneOf([0], 'Planned Control Rating is required')
      .required('Planned Control Rating is required'),
    implementationStatus: yup
      .number()
      .notOneOf([0], 'Implementation Status is required')
      .required('Implementation Status is required'),
    vulnerabilityLevel: yup
      .number()
      .notOneOf([0], 'Vulnerability Level is required')
      .required('Vulnerability Level is required'),
    probabilityofOccurrence: yup
      .number()
      .notOneOf([0], 'Probability of Occurrence is required')
      .required('Probability of Occurrence is required'),
    impactRating: yup.number().notOneOf([0], 'Impact of Rating is required').required('Impact of Rating is required'),
    targetDateforCompletion: yup.string().min(8, 'This field is required').required('This field is required'),
    owner: yup.number().notOneOf([0], 'Owner is required').required('Owner is required'),
    comments: yup.string().min(1, 'Must be at least 1 characters').required('This field is required')
  })

  useEffect(() => {
    getControlDropDown(set_control_dropdown, () => {})
    getEffortsDropDown(set_efforts_dropdown, () => {})
    getPlannedControlRatingDropdown(set_planned_control_rating_dropdown, () => {})
    getImplementationStatusDropdown(set_implementation_status_dropdown, () => {})
    getVulnerabilityLevelDropdown(set_vulnerability_level_dropdown, () => {})
    getCurrentLikelyHoodDropDown(set_probability_of_occurance_dropdown, () => {})
    getCurrentImpactDropDown(set_impact_rating_dropdown, () => {})
    getStrategyDropDown(set_strategy_dropdown)
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown)
    getTeamDropDown(set_team_dropdown, () => {})
    getSingleRisk(riskId, () => {}, setSingleRiskData)
  }, [])

  useEffect(() => {
    if (
      efforts_dropdown.length > 0 &&
      planned_control_rating_dropdown.length > 0 &&
      implementation_status_dropdown.length > 0 &&
      vulnerability_level_dropdown.length > 0 &&
      probability_of_occurance_dropdown.length > 0 &&
      impact_rating_dropdown.length > 0 &&
      strategy_dropdown.length > 0 &&
      additionalstakeholders_dropdown.length > 0 &&
      control_dropdown.length > 0 &&
      team_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [
    efforts_dropdown,
    planned_control_rating_dropdown,
    implementation_status_dropdown,
    vulnerability_level_dropdown,
    probability_of_occurance_dropdown,
    impact_rating_dropdown,
    strategy_dropdown,
    additionalstakeholders_dropdown,
    control_dropdown,
    team_dropdown
  ])

  // Initially Update Team DropdownUI and TeamMappingName and TeamDropdownIds
  useEffect(() => {
    if (singleMitigationData.mitigationteam.length > 0 && team_dropdown.length > 0) {
      const initialTeamName = []

      singleMitigationData.mitigationteam.map(id => {
        team_dropdown.find(team => {
          if (team.id == id) {
            if (!initialTeamName.includes(team.teamName)) {
              initialTeamName.push(team.teamName)
            }
          }
        })
      })
      setTeamMappingName(initialTeamName)
    }
  }, [singleMitigationData.mitigationteam, team_dropdown])

  // Current Solution
  // Security Requirments
  // Planning Strategy
  // Security Reccomendations
  // Mitigations Efforts
  // Mitigations Cost
  // Mitigation Percent
  // Mitigations Owner
  // Owner
  // Submitted By
  // Comments
  // Control Validation Details
  // Upload Artifact
  // Audit Trail

  const handleChange = (name, value) => {
    setSingleMitigationData({ ...singleMitigationData, [name]: value })
  }

  // targetDateforCompletion
  const handleDateChange = (name, value) => {
    setSingleMitigationData({ ...singleMitigationData, [name]: value })
  }

  // Team Change
  const handleTeamChange = value => {
    let arr = teamMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setTeamMappingName(arr)
  }

  useEffect(() => {
    if (singleMitigationData) {
      let teamIds = []

      teamMappingName.map(name => {
        team_dropdown.find(team => {
          if (team.teamName === name) {
            if (!teamIds.includes(team.id)) {
              teamIds.push(Number(team.id))
            }
          }
        })
      })
      setTeamDropdownIds([...teamIds])
    }
  }, [teamMappingName])

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

  const uploadFileHandle = id => {
    if (file) {
      const selectedFile = file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('attachment', selectedFile, selectedFile.name)
      formData.append('RefType', 'mitigation')
      formData.append('RefId', id)
      formData.append('Version', '1')
      formData.append('FileType', selectedFile.type)

      uploadFile(formData)
    } else {
      return
    }
  }

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

  const handleSubmitControlIds = () => {
    setTempSelectedControls([...selectedControls])
    handleChange('mitigationcontrols', selectedControls)
    setOpenControlModal(false)
  }

  const handleCloseControlModal = () => {
    setOpenControlModal(false)
    setSelectedControls(tempSelectedControls)
  }

  const handleControlsCheckBoxChange = id => {
    if (selectedControls.includes(id)) {
      setSelectedControls(prevState => {
        return prevState.filter(existId => existId !== id)
      })
    } else {
      setSelectedControls([...selectedControls, id])
    }
  }

  //api to save the details of the mitigation
  const handleFormSubmit = () => {
    let hasError = false

    const isValidSelection = arr =>
      Array.isArray(arr) && arr.length > 0 && !arr.includes('0') && !arr.includes('') && !arr.includes('none')

    if (!isValidSelection(teamDropdownIds)) {
      setTeamError('Please select at least one')
      hasError = true
    } else {
      setTeamError('')
    }

    if (hasError) return

    const payload = {
      ...singleMitigationData,
      mitigationteam: teamDropdownIds,
      riskId: riskId,
      last_update: moment(singleMitigationData.last_update).format('MM/DD/YYYY'),
      mitigationsubmissiondate: moment(singleMitigationData.mitigationsubmissiondate).format('MM/DD/YYYY'),
      targetDateforCompletion: moment(singleMitigationData.targetDateforCompletion).format('MM/DD/YYYY')
    }
    onSubmit(payload, uploadFileHandle)
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    try {
      setSavingForm(true)
      let res
      if (availableStep > 2 || formType === 'edit') {
        res = await apiHelper(
          `${authConfig.riskDevRakshitah_base_url}risks/mitigation/update/${singleMitigationData.id}`,
          'put',
          payload,
          {}
        )
        uploadFileHandle(singleMitigationData.id)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Update successfully!',
          showConfirmButton: true
        })
      } else {
        res = await apiHelper(
          `${authConfig.riskDevRakshitah_base_url}risks/${riskId}/mitigation/new`,
          'post',
          payload,
          {}
        )
        uploadFileHandle(res.data.data.id)
        CommonSwal(theme, {
          icon: 'success',
          title: res?.data?.data?.msg || 'Added successfully!',
          showConfirmButton: true
        })
      }

      setSavingForm(false)
      router.push('/home/riskManagement/risks')
    } catch (err) {
      setSavingForm(false)
      console.error(err)
      CommonSwal(theme, {
        icon: 'error',
        title: err?.response?.data || 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  const ControlsColumns = useMemo(() => {
    return [
      {
        field: 'action',
        headerName: t('Action'),
        sortable: false,
        flex: 0.07,
        valueGetter: params => `${params.row.description || ''}`,
        renderCell: ({ row }) => {
          return (
            <>
              <Checkbox
                onChange={() => handleControlsCheckBoxChange(row.id)}
                checked={selectedControls.includes(row.id)}
              />
            </>
          )
        }
      },
      {
        flex: 0.13,
        field: 'control-number',
        headerName: t('Control Code')
      },
      {
        flex: 0.3,
        field: 'name',
        headerName: t('Name'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 3 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <span>{content}</span>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.4,
        field: 'description',
        headerName: t('Description'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 2 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <span>{content}</span>
            </Tooltip>
          )
        }
      }
    ]
  }, [handleControlsCheckBoxChange, selectedControls, t])

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant='h4' sx={{ marginBottom: { xs: '16px', md: '20px' } }}>
          Risk Mitigation
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
            {/* Submisiion Date */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  type='date'
                  variant='outlined'
                  label={t('Mitigation submission date')}
                  defaultValue={currentDate}
                  name='mitigationsubmissiondate'
                  value={singleMitigationData.mitigationsubmissiondate}
                  disabled={true}
                />
              </FormControl>
            </Grid>
            {/* Planning Strategy */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Planning stratergy *')}
                </InputLabel>
                <Select
                  {...register('treatmentStrategy')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.treatmentStrategy}
                  onChange={e => handleChange('treatmentStrategy', e.target.value)}
                  label={t('Planning stratergy *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {strategy_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.treatmentStrategy?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Planned Control  */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('plannedControl')}
                  id='outlined-plannedControl'
                  type='text'
                  label='Planned Control *'
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleMitigationData.plannedControl}
                  onChange={e => handleChange('plannedControl', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.plannedControl?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Planned Control Rating */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Planned Control Rating *')}
                </InputLabel>
                <Select
                  {...register('plannedControlRating')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.plannedControlRating}
                  onChange={e => handleChange('plannedControlRating', e.target.value)}
                  label={t('Planned Control Rating *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {planned_control_rating_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.plannedControlRating?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Implementation Status */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Implementation Status *')}
                </InputLabel>
                <Select
                  {...register('implementationStatus')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.implementationStatus}
                  onChange={e => handleChange('implementationStatus', e.target.value)}
                  label={t('Implementation Status *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {implementation_status_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.implementationStatus?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Vulnerability Level */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Vulnerability Level *')}
                </InputLabel>
                <Select
                  {...register('vulnerabilityLevel')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.vulnerabilityLevel}
                  onChange={e => handleChange('vulnerabilityLevel', e.target.value)}
                  label={t('Vulnerability Level *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {vulnerability_level_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.vulnerabilityLevel?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Probability of Occurrence */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Probability of Occurrence')}
                </InputLabel>
                <Select
                  {...register('probabilityofOccurrence')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.probabilityofOccurrence}
                  onChange={e => handleChange('probabilityofOccurrence', e.target.value)}
                  label={t('Probability of Occurrence *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {probability_of_occurance_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                  {errors.probabilityofOccurrence?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Impact Rating */}

            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Impact Rating *')}
                </InputLabel>
                <Select
                  {...register('impactRating')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.impactRating}
                  onChange={e => handleChange('impactRating', e.target.value)}
                  label={t('Impact Rating *')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        width: 250
                      }
                    }
                  }}
                >
                  {impact_rating_dropdown.map(c => (
                    <MenuItem key={c.id} value={c.lookupId}>
                      {c.lookupName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.impactRating?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {/* Target Date for Completion */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('targetDateforCompletion')}
                  id='outlined-targetDateforCompletion'
                  label='Next Review Date'
                  type='date'
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleMitigationData.targetDateforCompletion}
                  onChange={e => handleChange('targetDateforCompletion', e.target.value)}
                />
              </FormControl>
            </Grid>
            {/* Owner */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.msg)} htmlFor='validation-basic-select'>
                  {t('Owner')}
                </InputLabel>
                <Select
                  {...register('owner')}
                  labelId='validation-basic-select'
                  value={singleMitigationData.owner}
                  onChange={e => handleChange('owner', e.target.value)}
                  label={t('Owner')}
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
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.owner?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {/* Comments */}
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth>
                <TextField
                  {...register('comments')}
                  id='outlined-comments'
                  label={t('Comments *')}
                  variant='outlined'
                  disabled={formType === 'view'}
                  value={singleMitigationData.comments}
                  onChange={e => handleChange('comments', e.target.value)}
                />
                <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.comments?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {/* Team */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ background: theme.palette.company.lighttertiary }}>
                <Box
                  sx={{
                    height: '56px',
                    border: '1px solid',
                    background: openTeamPopper ? theme.palette.company.primary : theme.palette.company.background,
                    borderColor: theme.palette.company.primary,
                    color: openTeamPopper ? theme.palette.company.background : theme.palette.company.primary,
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    setTeamAnchorEl(openTeamPopper ? '' : e.currentTarget)
                    setOpenTeamPopper(openTeamPopper ? false : true)
                  }}
                >
                  Select Team
                </Box>
                {teamMappingName.length > 0 && (
                  <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {teamMappingName.map(item => {
                      return (
                        <Box
                          key={item}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${theme.palette.company.primary}20`,
                            padding: '5px 10px 5px 5px',
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
                            onClick={() => {
                              handleTeamChange(item)
                            }}
                          >
                            {' '}
                            <ClearRoundedIcon
                              sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                            />{' '}
                          </Box>{' '}
                          <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                            {item}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </Box>
              <TeamPopper
                openTeamPopper={openTeamPopper}
                setOpenTeamPopper={setOpenTeamPopper}
                team_dropdown={team_dropdown}
                teamMappingName={teamMappingName}
                handleTeamChange={handleTeamChange}
                teamAnchorEl={teamAnchorEl}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{teamError}</FormHelperText>
            </Grid>
            {/* Mitigation Control */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ background: theme.palette.company.lighttertiary }}>
                <Box
                  sx={{
                    height: '56px',
                    border: '1px solid',
                    background: openTeamPopper ? theme.palette.company.primary : theme.palette.company.background,
                    borderColor: theme.palette.company.primary,
                    color: openTeamPopper ? theme.palette.company.background : theme.palette.company.primary,
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenControlModal(true)}
                >
                  Mitigation Controls
                </Box>
                {selectedControlsCode.length > 0 && (
                  <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedControlsCode.map(item => {
                      return (
                        <Box
                          key={item}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${theme.palette.company.primary}20`,
                            padding: '5px 10px 5px 10px',
                            borderRadius: '20px',
                            gap: '8px'
                          }}
                        >
                          <Typography variant='body2' sx={{ color: theme.palette.company.primary }}>
                            {item}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
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
                    Upload Evidence
                  </Button>
                </FormControl>
                {file && (
                  <Box display={'flex'} alignItems={'center'} gap={5} maxWidth={'40%'}>
                    <Typography
                      variant='body1'
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}
                      key={0}
                    >
                      Selected File:{' '}
                      <Typography variant='body1Bold' sx={{ color: theme.palette.company.primary }}>
                        {' '}
                        {file.name}{' '}
                      </Typography>
                    </Typography>
                    <IconButton onClick={() => handleOpenDocumentViewer()} sx={{ cursor: 'pointer' }}>
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

                {singleMitigationData &&
                  singleMitigationData.complianceFilesDtoList &&
                  singleMitigationData.complianceFilesDtoList.length > 0 && (
                    <Button
                      variant='outlined'
                      sx={{ padding: '10px 30px', width: 'fit-content', height: '46px', margin: '0px' }}
                      tabIndex={-1}
                      onClick={() => handleOpenModel(singleMitigationData.complianceFilesDtoList)}
                    >
                      {' '}
                      Attachments{' '}
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
                  onClick={() => setActiveStep(1)}
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
      {/* Link Policies Modal */}
      <CommonLinkDrawer
        drawerTitle={'Link Controls'}
        open={openControlModal}
        setOpen={setOpenControlModal}
        savingForm={savingForm}
        columns={ControlsColumns}
        keyForName={'name'}
        keyForId={'id'}
        item_dropdown={control_dropdown}
        selectedItems={selectedControls}
        handleCheckBoxChange={handleControlsCheckBoxChange}
        handleSubmit={handleSubmitControlIds}
        handleCancel={handleCloseControlModal}
      />
    </>
  )
}

export default RiskMitigationForm
