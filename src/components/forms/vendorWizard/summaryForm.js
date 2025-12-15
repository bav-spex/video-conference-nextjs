import React, { useEffect, useState } from 'react'

import { Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Topbar from 'components/Topbar'
import moment from 'moment'
import { useRouter } from 'next/router'
import {
  getAdditionlStakeHoldersDropDown,
  getServiceDropdown,
  getVendorCategoryDropdown,
  getVendorStatusDropdown,
  getVendorTypeDropdown
} from 'services/common'
import { getAllVendorFrameworks } from 'services/thirdparty/vendorFramework/vendorFrameworkServices'
import { getVendorAsessmentSummary } from 'services/thirdparty/vendorWizard/vendorWizardServices'

const LabelAndValue = ({ label, value }) => {
  return (
    <Box sx={{ marginBottom: { xs: '10px', md: '20px' } }} item>
      <Typography fontWeight={600}>{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  )
}

const SummaryForm = ({
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
  const theme = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [frameworks_dropdown, set_frameworks_dropdown] = useState([])
  const [users_dropdown, set_users_dropdown] = useState([])
  const [category_dropdown, set_category_dropdown] = useState([])
  const [vendorType_dropdown, set_vendorType_dropdown] = useState([])
  const [vendor_assessment_status_dropdown, set_vendor_assessment_status_dropdown] = useState([])
  const [service_dropdown, set_service_dropdown] = useState([])
  const [serviceMappingName, setServiceMappingName] = useState([])
  const [singleVendorData, setSingleVendorData] = useState(vendorData)
  const [vendorAssessmentSummaryData, setVendorAssessmentSummaryData] = useState()

  useEffect(() => {
    getAllVendorFrameworks(set_frameworks_dropdown)
    getAdditionlStakeHoldersDropDown(set_users_dropdown)
    getVendorTypeDropdown(set_vendorType_dropdown)
    getVendorCategoryDropdown(set_category_dropdown)
    getServiceDropdown(set_service_dropdown)
    getVendorStatusDropdown(set_vendor_assessment_status_dropdown)
  }, [])

  useEffect(() => {
    if (vendorData) {
      setSingleVendorData(vendorData)
    }
  }, [vendorData])
  useEffect(() => {
    if (vendorId) {
      getVendorAsessmentSummary(vendorId, setVendorAssessmentSummaryData, setLoading)
    }
  }, [vendorId])

  useEffect(() => {
    if (
      frameworks_dropdown.length > 0 &&
      users_dropdown.length > 0 &&
      vendorType_dropdown.length > 0 &&
      category_dropdown.length > 0 &&
      service_dropdown.length > 0 &&
      vendor_assessment_status_dropdown.length > 0 &&
      vendorAssessmentSummaryData
    ) {
      setLoading(false)
    }
  }, [
    frameworks_dropdown,
    users_dropdown,
    category_dropdown,
    vendorType_dropdown,
    service_dropdown,
    vendorAssessmentSummaryData,
    vendor_assessment_status_dropdown
  ])

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
                          query: { activeStep: 2, availableStep: 2, formType: formType }
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
                <Grid container spacing={{ xs: 4, md: 5 }}>
                  {[
                    {
                      label: 'Vendor Name',
                      value: vendorAssessmentSummaryData?.vendor?.name
                    },
                    {
                      label: 'Vendor Email',
                      value: vendorAssessmentSummaryData?.vendor?.email
                    },
                    {
                      label: 'Vendor number',
                      value: vendorAssessmentSummaryData?.vendor?.moblieNumber
                    },
                    {
                      label: 'Contact Person Name',
                      value: vendorAssessmentSummaryData?.vendor?.primaryContactPersonName
                    },
                    {
                      label: 'Contact Person Email',
                      value: vendorAssessmentSummaryData?.vendor?.primaryContactPersonEmail
                    },
                    {
                      label: 'Contact Person Number',
                      value: vendorAssessmentSummaryData?.vendor?.primaryContactPersonContactNumber
                    },
                    {
                      label: 'SPOC Name',
                      value: vendorAssessmentSummaryData?.vendor?.spocName
                    },
                    {
                      label: 'SPOC Email',
                      value: vendorAssessmentSummaryData?.vendor?.spocEmail
                    },
                    {
                      label: 'SPOC Number',
                      value: vendorAssessmentSummaryData?.vendor?.spocMobileNumber
                    },
                    {
                      label: 'Is Critical',
                      value: vendorAssessmentSummaryData?.vendor?.isCritical === 'true' ? 'Yes' : 'No'
                    },
                    {
                      label: 'Last Assessment Date',
                      value: moment(vendorAssessmentSummaryData?.vendor?.assessmentDate).format('DD-MM-YYYY')
                    },
                    {
                      label: 'Due Date',
                      value: moment(vendorAssessmentSummaryData?.vendor?.dueDate).format('DD-MM-YYYY')
                    },
                    {
                      label: 'Category',
                      value: category_dropdown.find(
                        f => f.lookupId * 1 === vendorAssessmentSummaryData?.vendor?.category * 1
                      )?.lookupName
                    },
                    {
                      label: 'Services',
                      value: serviceMappingName.join(', ')
                    },
                    {
                      label: 'Vendor Type',
                      value: vendorType_dropdown.find(
                        f => f.lookupId * 1 === vendorAssessmentSummaryData?.vendor?.type * 1
                      )?.lookupName
                    },
                    {
                      label: 'Assessment Status',
                      value: vendor_assessment_status_dropdown.find(
                        f => f.lookupId * 1 === vendorAssessmentSummaryData?.vendor?.status * 1
                      )?.lookupName
                    }
                  ].map(item => {
                    return (
                      <Grid item xs={12} md={6} key={item.label}>
                        <LabelAndValue label={item.label} value={item.value} />
                      </Grid>
                    )
                  })}
                </Grid>
                <Grid item xs={12} sx={{ mt: { xs: '16px', md: '30px' } }}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '10px'
                    }}
                  >
                    <Button
                      // onClick={() => router.push('/home/thirdparty/vendorWizard')}
                      variant='secondary'
                      sx={{ padding: '10px 30px', height: '46px', margin: '0px' }}
                    >
                      Email Summary
                    </Button>
                    <Button
                      // onClick={() => router.push('/home/thirdparty/vendorWizard')}
                      variant='secondary'
                      sx={{ padding: '10px 30px', height: '46px', margin: '0px' }}
                    >
                      Download
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ mt: { xs: '16px', md: '30px' } }}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                      variant='outlined'
                      sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                      onClick={() => {
                        router.push({
                          pathname: `/home/thirdparty/vendorWizard/vendorAssessment/${vendorId}`,
                          query: { activeStep: 2, availableStep: 2 }
                        })
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => router.push('/home/thirdparty/vendorWizard')}
                      variant='secondary'
                      sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
                    >
                      Done
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SummaryForm
