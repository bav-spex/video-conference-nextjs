import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloudUpload from '@mui/icons-material/CloudUpload'
import RemoveRedEye from '@mui/icons-material/RemoveRedEye'
import { FormHelperText, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  getAdditionlStakeHoldersDropDown,
  getAssetCategoryDropdown,
  getControlRegulationDropDown,
  getCurrentImpactDropDown,
  getCurrentLikelyHoodDropDown,
  getRiskSourceDropDown,
  getTeamDropDown,
  getThreatDropDown,
  getRiskStatusDropDown,
  getVulnerabilityLevelDropdown,
  getRiskCategoryDropdown,
  uploadFile
} from 'services/common'
import { getAllAssets } from 'services/Risks/assets/AssetService'
import { getAllVulnerability } from 'services/Risks/vulnerabilityManagement/vulnerabilityService'
import apiHelper from 'store/apiHelper'
import * as yup from 'yup'

import DocumentGrid from '../documentGrid'
import DocumentViewer from '../documentViewer'
import AdditionalStakeholderPopper from './AdditionalStakeholderPopper'
import TeamPopper from './TeamPopper'
import ThreatMappingDrawer from './threatMappingDrawer'
import VulnerabilityMappingDrawer from './vulnerabilityMappingDrawer'

const RiskIdentificationForm = ({
  formType,
  riskId,
  riskData,
  setRiskData,
  setActiveStep,
  availableStep,
  setAvailableStep
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const [file, setFile] = useState()
  const [type, setType] = useState('')

  const [asset_category_dropdown, set_asset_category_dropdown] = useState([])
  const [risksource_dropdown, set_risksource_dropdown] = useState([])

  const [affectedassets_dropdown, set_affectedassets_dropdown] = useState([])
  const [risk_category_dropdown, set_risk_category_dropdown] = useState([])
  const [vulnerability_level_dropdown, set_vulnerability_level_dropdown] = useState([])
  const [probability_of_occurance_dropdown, set_probability_of_occurance_dropdown] = useState([])
  const [controlregulation_dropdown, set_controlregulation_dropdown] = useState([])
  const [currentimpact_dropdown, set_currentimpact_dropdown] = useState([])
  const [controlstatus_dropdown, set_controlstatus_dropdown] = useState([])

  const [vulnerabilities_dropdown, set_vulnerabilities_dropdown] = useState([])
  const [vulnerabilitiesDropdownIds, setVulnerabilitiesDropdownIds] = useState([])
  const [vulnerabilitiesError, setVulnerabilitiesError] = useState()
  const [vulnerabilitiesMappingIds, setVulnerabilitiesMappingIds] = useState([])

  const [threat_dropdown, set_threat_dropdown] = useState([])
  const [threatMappingName, setThreatMappingName] = useState([])
  const [threatDropdownIds, setThreatDropdownIds] = useState([])
  const [threatError, setThreatError] = useState()

  const [team_dropdown, set_team_dropdown] = useState([])
  const [teamMappingName, setTeamMappingName] = useState([])
  const [teamDropdownIds, setTeamDropdownIds] = useState([])
  const [teamError, setTeamError] = useState()

  const [additionalstakeholders_dropdown, set_additionalstakeholders_dropdown] = useState([])
  const [additionalstakeholdersMappingName, setAdditionalstakeholdersMappingName] = useState([])
  const [additionalstakeholdersDropdownIds, setAdditionalstakeholdersDropdownIds] = useState([])
  const [additionalstakeholdersError, setAdditionalstakeholdersError] = useState()

  const [documentsArray, setDocumentsArray] = useState([])
  const [open, setOpen] = useState(false)
  const [openDocumentViewer, setDocumentViewer] = useState(false)

  const [singleRiskData, setSingleRiskData] = useState(riskData)

  const [savingForm, setSavingForm] = useState(false)

  const [openThreatMappingDrawer, setOpenThreatMappingDrawer] = useState(false)
  const [openVulnerabilitiesMappingDrawer, setOpenVulnerabilitiesMappingDrawer] = useState(false)

  const [teamAnchorEl, setTeamAnchorEl] = useState(null)
  const [openTeamPopper, setOpenTeamPopper] = useState(false)
  const [additionalstakeholdersAnchorEl, setAdditionalstakeholdersAnchorEl] = useState(null)
  const [openAdditionalStakeholderPopper, setOpenAdditionalStakeholderPopper] = useState(false)

  useEffect(() => {
    if (riskData) {
      setSingleRiskData(riskData)
    }
  }, [riskData])

  const validationSchema = yup.object().shape({
    riskIdentifier: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    risksource: yup.number().notOneOf([0], 'Risksource is required').required('Risksource is required'),
    subject: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    riskCategory: yup.number().notOneOf([0], 'Risk Category is required').required('Risk Category is required'),
    affectedAssets: yup.number().notOneOf([0], 'Affected Assets is required').required('Affected Assets is required'),
    controlnumber: yup.string().min(1, 'Must be at least 1 characters').required('This field is required'),
    controlregulation: yup
      .number()
      .notOneOf([0], 'Control regulation is required')
      .required('Control regulation is required'),
    vulnerability_level: yup
      .number()
      .notOneOf([0], 'Vulnerability level is required')
      .required('Vulnerability level is required'),
    risk_owner: yup.number().notOneOf([0], 'Risk Owner is required').required('Risk Owner is required'),
    probability_of_occurrence: yup
      .number()
      .notOneOf([0], 'Probability of occurance is required')
      .required('Probability of occurance is required'),
    status: yup.number().notOneOf([0], 'Status is required').required('status is required'),
    impact_rating: yup.number().notOneOf([0], 'Impact rating is required').required('Impact rating is required')
  })

  useEffect(() => {
    //getRiskDropDown(set_vulnerabilities_dropdown, () => {})
    getAllVulnerability(
      data => {
        const formatted = data.map(v => ({
          lookupId: v.id,
          lookupName: v.name // Mapping from your API structure
        }))
        set_vulnerabilities_dropdown(formatted)
      },
      () => {}
    )

    getThreatDropDown(set_threat_dropdown, () => {})
    getAssetCategoryDropdown(set_asset_category_dropdown, () => {})
    getRiskCategoryDropdown(set_risk_category_dropdown, () => {})
    getRiskSourceDropDown(set_risksource_dropdown, () => {})
    getVulnerabilityLevelDropdown(set_vulnerability_level_dropdown, () => {})
    getCurrentLikelyHoodDropDown(set_probability_of_occurance_dropdown, () => {})
    getControlRegulationDropDown(set_controlregulation_dropdown, () => {})
    getCurrentImpactDropDown(set_currentimpact_dropdown, () => {})
    getAllAssets(set_affectedassets_dropdown, () => {})
    getTeamDropDown(set_team_dropdown, () => {})
    getAdditionlStakeHoldersDropDown(set_additionalstakeholders_dropdown, () => {})
    getRiskStatusDropDown(set_controlstatus_dropdown, () => {})
  }, [])

  useEffect(() => {
    if (
      vulnerabilities_dropdown.length > 0 &&
      threat_dropdown.length > 0 &&
      asset_category_dropdown.length > 0 &&
      risk_category_dropdown.length > 0 &&
      risksource_dropdown.length > 0 &&
      vulnerability_level_dropdown.length > 0 &&
      probability_of_occurance_dropdown.length > 0 &&
      controlregulation_dropdown.length > 0 &&
      currentimpact_dropdown.length > 0 &&
      affectedassets_dropdown.length > 0 &&
      team_dropdown.length > 0 &&
      additionalstakeholders_dropdown.length > 0 &&
      controlstatus_dropdown.length > 0
    ) {
      setLoading(false)
    }
  }, [
    vulnerabilities_dropdown,
    threat_dropdown,
    asset_category_dropdown,
    risk_category_dropdown,
    risksource_dropdown,
    vulnerability_level_dropdown,
    probability_of_occurance_dropdown,
    controlregulation_dropdown,
    currentimpact_dropdown,
    affectedassets_dropdown,
    team_dropdown,
    additionalstakeholders_dropdown,
    controlstatus_dropdown
  ])

  // Initially Update Threat DropdownUI and ThreatMappingName and ThreatDropdownIds
  useEffect(() => {
    if (singleRiskData.threat.length > 0 && threat_dropdown.length > 0) {
      const initialThreatName = []

      singleRiskData.threat.map(id => {
        threat_dropdown.find(threat => {
          if (threat.lookupId == id) {
            if (!initialThreatName.includes(threat.lookupName)) {
              initialThreatName.push(threat.lookupName)
            }
          }
        })
      })
      setThreatMappingName(initialThreatName)
    }
  }, [singleRiskData.threat, threat_dropdown])

  // Initially Update Team DropdownUI and TeamMappingName and TeamDropdownIds
  useEffect(() => {
    if (singleRiskData.team.length > 0 && team_dropdown.length > 0) {
      const initialTeamName = []

      singleRiskData.team.map(id => {
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
  }, [singleRiskData.team, team_dropdown])

  // Initially Update AdditionalStackHolders DropdownUI and AdditionalStackHoldersMappingName and AdditionalStackHoldersDropdownIds
  useEffect(() => {
    if (singleRiskData.additionalstakeholders.length > 0 && additionalstakeholders_dropdown.length > 0) {
      const initialStackName = []

      singleRiskData.additionalstakeholders.map(id => {
        additionalstakeholders_dropdown.find(stack => {
          if (stack.id == id) {
            if (!initialStackName.includes(stack.fullName)) {
              initialStackName.push(stack.fullName)
            }
          }
        })
      })
      setAdditionalstakeholdersMappingName(initialStackName)
    }
  }, [additionalstakeholders_dropdown, singleRiskData.additionalstakeholders])

  // Change Events for
  // riskIdentifier
  // Subject
  // asset_category
  // Risk Source
  // Risk Score
  // External Reference Id
  // Current Likely Hood
  // Control Regulation
  // Current Impact
  // Control Number
  // Risk Assessment
  // Additional Notes
  // Risk Owner
  const handleChange = (name, value) => {
    if (name === 'affectedAssets') {
      const selectedAsset = affectedassets_dropdown.find(asset => asset.id === Number(value))

      let updatedAssetCategoryName = ''
      let updatedAssetCategoryId = ''

      if (selectedAsset && asset_category_dropdown.length > 0) {
        const assetValue = selectedAsset.assetValue // already a number

        const matchingCategory = asset_category_dropdown.find(category => category.lookupId === assetValue)

        if (matchingCategory) {
          updatedAssetCategoryName = matchingCategory.lookupName
          updatedAssetCategoryId = matchingCategory.lookupId
        } else {
          console.warn('No matching asset category found for assetValue:', assetValue)
        }
      }

      setSingleRiskData(prev => ({
        ...prev,
        affectedAssets: value,
        asset_category: updatedAssetCategoryId,
        asset_category_name: updatedAssetCategoryName
      }))
    } else {
      setSingleRiskData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Risk Change
  const handleVulnerabilitiesChange = id => {
    let updated = [...vulnerabilitiesMappingIds]
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id)
    } else {
      updated.push(id)
    }
    setVulnerabilitiesMappingIds(updated)
  }

  useEffect(() => {
    if (singleRiskData) {
      setVulnerabilitiesDropdownIds([...vulnerabilitiesMappingIds])
    }
  }, [vulnerabilitiesMappingIds])

  // Threat Change
  const handleThreatChange = value => {
    let arr = threatMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setThreatMappingName(arr)
  }

  useEffect(() => {
    if (singleRiskData) {
      let threatIds = []

      threatMappingName.map(name => {
        threat_dropdown.find(threat => {
          if (threat.lookupName === name) {
            if (!threatIds.includes(threat.lookupId)) {
              threatIds.push(threat.lookupId)
            }
          }
        })
      })
      setThreatDropdownIds([...threatIds])
    }
  }, [threatMappingName])

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
    if (singleRiskData) {
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

  // Additional Stake Holders Change
  const handleAdditionalStakeHoldersChange = value => {
    let arr = additionalstakeholdersMappingName
    if (arr.includes(value)) {
      arr = arr.filter(n => n !== value)
    } else {
      arr = [...arr, value]
    }
    setAdditionalstakeholdersMappingName(arr)
  }
  useEffect(() => {
    if (singleRiskData) {
      let stakeHolderIds = []

      additionalstakeholdersMappingName.map(name => {
        additionalstakeholders_dropdown.find(stake => {
          if (stake.fullName === name) {
            if (!stakeHolderIds.includes(stake.id)) {
              stakeHolderIds.push(stake.id)
            }
          }
        })
      })
      setAdditionalstakeholdersDropdownIds([...stakeHolderIds])
    }
  }, [additionalstakeholdersMappingName])

  useEffect(() => {
    if (singleRiskData?.vulnerabilities?.length > 0) {
      setVulnerabilitiesMappingIds(singleRiskData.vulnerabilities)
    }
  }, [singleRiskData])

  // File Change
  const handleFileChange = async e => {
    const fileData = e.target.files[0]
    setFile(fileData)
  }

  const uploadFileHandle = id => {
    if (file) {
      const selectedFile = file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('attachment', selectedFile, selectedFile.name)
      formData.append('RefType', 'risk')
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
    mode: 'onSubmit',
    defaultValues: {
      ...singleRiskData
    }
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
    let hasError = false

    const isValidSelection = arr =>
      Array.isArray(arr) && arr.length > 0 && !arr.includes('0') && !arr.includes('') && !arr.includes('none')

    if (!isValidSelection(vulnerabilitiesDropdownIds)) {
      setVulnerabilitiesError('Please select at least one')
      hasError = true
    } else {
      setVulnerabilitiesError('')
    }

    if (!isValidSelection(threatDropdownIds)) {
      setThreatError('Please select at least one')
      hasError = true
    } else {
      setThreatError('')
    }

    if (!isValidSelection(teamDropdownIds)) {
      setTeamError('Please select at least one')
      hasError = true
    } else {
      setTeamError('')
    }

    if (!isValidSelection(additionalstakeholdersDropdownIds)) {
      setAdditionalstakeholdersError('Please select at least one')
      hasError = true
    } else {
      setAdditionalstakeholdersError('')
    }

    if (hasError) return

    const payload = {
      ...singleRiskData,
      vulnerabilities: vulnerabilitiesMappingIds,

      threat: threatDropdownIds,
      team: teamDropdownIds,
      additionalstakeholders: additionalstakeholdersDropdownIds
    }
    onSubmit(payload, uploadFileHandle)
  }

  const onSubmit = async (payload, uploadFileHandle) => {
    if (availableStep > 0) {
      setActiveStep(1)

      return
    }
    try {
      setSavingForm(true)
      let res
      if (availableStep > 0 || riskId) {
        res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}risks/update/${payload.id}`, 'put', payload, {})
        uploadFileHandle(riskId)
        setRiskData({ id: riskId, payload })
        setActiveStep(1)
        setAvailableStep(1)
      } else {
        res = await apiHelper(`${authConfig.riskDevRakshitah_base_url}risks/new`, 'post', payload, {})
        uploadFileHandle(res.data.data.id)
        setRiskData({ id: res.data.data.id, payload })
        setActiveStep(1)
        setAvailableStep(1)
      }
      // router.push('/home/riskManagement/risks')
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
      <Typography variant='h4' sx={{ marginBottom: { xs: '16px', md: '20px' } }}>
        Risk Identification
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
          {/* Risk Identifier  */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <TextField
                {...register('riskIdentifier')}
                id='outlined-riskIdentifier'
                label={t('Risk Identifier *')}
                variant='outlined'
                disabled={formType === 'view'}
                value={singleRiskData.riskIdentifier}
                onChange={e => handleChange('riskIdentifier', e.target.value)}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.riskIdentifier?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {/* Risk Source  */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Risk Source *')}
              </InputLabel>
              <Select
                {...register('risksource')}
                labelId='risksource-label'
                id='risksource'
                value={singleRiskData.risksource}
                onChange={e => handleChange('risksource', e.target.value)}
                label={t('Risk Source *')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {risksource_dropdown.length > 0 ? (
                  risksource_dropdown.map(item => (
                    <MenuItem key={item.id} value={item.lookupId}>
                      {item.lookupName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Risksource available</MenuItem>
                )}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.risksource?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {/* Subject */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <TextField
                {...register('subject')}
                id='outlined-subject'
                label={t('Subject *')}
                variant='outlined'
                disabled={formType === 'view'}
                value={singleRiskData.subject}
                onChange={e => handleChange('subject', e.target.value)}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.subject?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Risk Catrgory  */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                Risk Category *
              </InputLabel>
              <Select
                {...register('riskCategory')}
                label={'Risk Category *'}
                value={singleRiskData.riskCategory}
                onChange={e => handleChange('riskCategory', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {risk_category_dropdown.map(c => (
                  <MenuItem key={c.id} value={c.lookupId}>
                    {c.lookupName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.riskCategory?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Affected Assets *')}
              </InputLabel>
              <Select
                {...register('affectedAssets')}
                label={t('Affected Assets *')}
                value={singleRiskData.affectedAssets}
                onChange={e => handleChange('affectedAssets', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {affectedassets_dropdown.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.assetName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.affectedAssets?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label='Asset Category'
                value={singleRiskData.asset_category_name || ''}
                InputProps={{ readOnly: true }}
                disabled={true}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.asset_category?.message}</FormHelperText>
            </FormControl>
          </Grid>
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
                onClick={() => setOpenThreatMappingDrawer(true)}
              >
                Select Threat Mapping
              </Box>
              {threatMappingName.length > 0 && (
                <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {threatMappingName.map(item => {
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
                            handleThreatChange(item)
                          }}
                        >
                          {' '}
                          <ClearRoundedIcon
                            sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                          />{' '}
                        </Box>{' '}
                        <Typography
                          variant='body2'
                          sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>
            <ThreatMappingDrawer
              openThreatMappingDrawer={openThreatMappingDrawer}
              setOpenThreatMappingDrawer={setOpenThreatMappingDrawer}
              threat_dropdown={threat_dropdown}
              threatMappingName={threatMappingName}
              handleThreatChange={handleThreatChange}
            />
            <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{threatError}</FormHelperText>
          </Grid>

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
                onClick={() => setOpenVulnerabilitiesMappingDrawer(true)}
              >
                Select Vulnerability (Cause of the Risk)
              </Box>

              {vulnerabilitiesMappingIds.length > 0 && (
                <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {vulnerabilitiesMappingIds.map(id => {
                    const item = vulnerabilities_dropdown.find(v => v.lookupId === id)

                    return (
                      <Box
                        key={id}
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
                            handleVulnerabilitiesChange(id)
                          }}
                        >
                          <ClearRoundedIcon
                            sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                          />
                        </Box>
                        <Typography
                          variant='body2'
                          sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                        >
                          {item?.lookupName || 'Unknown'}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>

            <VulnerabilityMappingDrawer
              openVulnerabilitiesMappingDrawer={openVulnerabilitiesMappingDrawer}
              setOpenVulnerabilitiesMappingDrawer={setOpenVulnerabilitiesMappingDrawer}
              vulnerabilities_dropdown={vulnerabilities_dropdown}
              vulnerabilitiesMappingIds={vulnerabilitiesMappingIds}
              handleVulnerabilitiesChange={handleVulnerabilitiesChange}
            />

            <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{vulnerabilitiesError}</FormHelperText>
          </Grid>

          {/*Vulnerability Level */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Vulnerability Level *')}
              </InputLabel>
              <Select
                {...register('vulnerability_level')}
                label={t('Vulnerability Level *')}
                value={singleRiskData.vulnerability_level}
                onChange={e => handleChange('vulnerability_level', e.target.value)}
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
                {errors.vulnerability_level?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Probability of Occurrence *')}
              </InputLabel>
              <Select
                {...register('probability_of_occurrence')}
                fullWidth
                label={t('Probability of Occurrence *')}
                value={singleRiskData.probability_of_occurrence}
                onChange={e => handleChange('probability_of_occurrence', e.target.value)}
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
                  <MenuItem key={c.lookupId} value={c.lookupId}>
                    {c.lookupName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                {errors.probability_of_occurrence?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Existing Control Number */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <TextField
                {...register('controlnumber')}
                id='outlined-controlnumber'
                label={t('Control Number *')}
                variant='outlined'
                disabled={formType === 'view'}
                value={singleRiskData.controlnumber}
                onChange={e => handleChange('controlnumber', e.target.value)}
              />
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.controlnumber?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Impact of Rating */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Impact of Rating *')}
              </InputLabel>
              <Select
                {...register('impact_rating')}
                fullWidth
                label={t('Impact of Rating *')}
                value={singleRiskData.impact_rating}
                onChange={e => handleChange('impact_rating', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {currentimpact_dropdown.map(c => (
                  <MenuItem key={c.id} value={c.lookupId}>
                    {c.lookupName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.impact_rating?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Control Regulation  */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Control Regulation *')}
              </InputLabel>
              <Select
                {...register('controlregulation')}
                fullWidth
                label={t('Control Regulation *')}
                value={singleRiskData.controlregulation}
                onChange={e => handleChange('controlregulation', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {controlregulation_dropdown.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.framework_Name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>
                {errors.controlregulation?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Risk Owner *')}
              </InputLabel>
              <Select
                {...register('risk_owner')}
                fullWidth
                label={t('Risk Owner *')}
                value={singleRiskData.risk_owner}
                onChange={e => handleChange('risk_owner', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {additionalstakeholders_dropdown.map(item => (
                  <MenuItem key={item.id} value={Number(item.id)}>
                    {item.fullName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.risk_owner?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel id='validation-basic-select' htmlFor='validation-basic-select'>
                {t('Status *')}
              </InputLabel>
              <Select
                {...register('status')}
                fullWidth
                label={t('Status *')}
                value={singleRiskData.status}
                onChange={e => handleChange('status', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250
                    }
                  }
                }}
              >
                {controlstatus_dropdown.map(c => (
                  <MenuItem key={c.lookupId} value={c.lookupId}>
                    {c.lookupName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Team */}
          <Grid item xs={12} md={6} lg={4}>
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
                        <Typography
                          variant='body2'
                          sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                        >
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

          {/* Additional Stakeholders */}
          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ background: theme.palette.company.lighttertiary }}>
              <Box
                sx={{
                  height: '56px',
                  border: '1px solid',
                  px: '10px',
                  textAlign: 'center',
                  background: openAdditionalStakeholderPopper
                    ? theme.palette.company.primary
                    : theme.palette.company.background,
                  borderColor: theme.palette.company.primary,
                  color: openAdditionalStakeholderPopper
                    ? theme.palette.company.background
                    : theme.palette.company.primary,
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  setAdditionalstakeholdersAnchorEl(openAdditionalStakeholderPopper ? '' : e.currentTarget)
                  setOpenAdditionalStakeholderPopper(openAdditionalStakeholderPopper ? false : true)
                }}
              >
                Select Additional Stakeholders
              </Box>
              {additionalstakeholdersMappingName.length > 0 && (
                <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {additionalstakeholdersMappingName.map(item => {
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
                            handleAdditionalStakeHoldersChange(item)
                          }}
                        >
                          {' '}
                          <ClearRoundedIcon
                            sx={{ width: '14px', height: '14px', color: theme.palette.company.primary }}
                          />{' '}
                        </Box>{' '}
                        <Typography
                          variant='body2'
                          sx={{ color: theme.palette.company.primary, wordBreak: 'break-all' }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>
            <AdditionalStakeholderPopper
              openAdditionalStakeholderPopper={openAdditionalStakeholderPopper}
              setOpenAdditionalStakeholderPopper={setOpenAdditionalStakeholderPopper}
              additionalstakeholders_dropdown={additionalstakeholders_dropdown}
              additionalstakeholdersMappingName={additionalstakeholdersMappingName}
              handleAdditionalStakeHoldersChange={handleAdditionalStakeHoldersChange}
              additionalstakeholdersAnchorEl={additionalstakeholdersAnchorEl}
            />
            <FormHelperText sx={{ color: 'error.main', mx: '0px' }}>{additionalstakeholdersError}</FormHelperText>
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
                    
                    sx={{ cursor: 'pointer' }}
                  >
                    <RemoveRedEye sx={{ cursor: 'pointer' }} titleAccess='Download Evidence' />
                  </IconButton>
                </Box>
              )}

              <DocumentViewer
                file={file}
                type={type}
                open={openDocumentViewer}
                handleCancelModel={handleCancelDocumentViewer}
              ></DocumentViewer>

              {singleRiskData && singleRiskData.complianceFilesDtoList && singleRiskData.complianceFilesDtoList.length > 0 && (
                <Button
                  variant='outlined'
                  sx={{ padding: '10px 30px', width: 'fit-content', height: '46px', margin: '0px' }}
                  tabIndex={-1}
                  onClick={() => handleOpenModel(singleRiskData.complianceFilesDtoList)}
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
      )}
    </form>
  )
}

export default RiskIdentificationForm
