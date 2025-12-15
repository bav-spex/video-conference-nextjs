import React, { useEffect, useState } from 'react'

import { Box, Button, CircularProgress, Step, StepLabel, Stepper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import VendorForm from 'components/forms/vendors/vendorForm'
import Topbar from 'components/Topbar'
import { useRouter } from 'next/router'

const RiskAssessmentForm = ({
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

  const [singleVendorData, setSingleVendorData] = useState(vendorData)

  useEffect(() => {
    if (vendorData) {
      setSingleVendorData(vendorData)
    }
  }, [vendorData])

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
                  onClick={() => availableStep >= item.stepNumber && setActiveStep(item.stepNumber)}
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
            Risk Assessment
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RiskAssessmentForm
