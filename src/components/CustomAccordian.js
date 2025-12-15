import { useState } from 'react'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import { Box, IconButton, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { decrypt, encrypt } from 'utils/routingEncryption'

export default function CustomAccordion({ page = 'framework', expanded, section, handleChange }) {
  const theme = useTheme()
  const router = useRouter()
  const frameworkId = decrypt(router.query.frameworkId)

  return (
    <>
      <Accordion
        key={section.id}
        expanded={expanded === section.id}
        onChange={handleChange(section.id)}
        sx={{
          background: theme.palette.company.background,
          boxShadow: '0px 0px 15px #301E4E1A',

          '&.Mui-expanded': {
            margin: '0px 0px 0px 0px', // accordion margin when expanded
            boxShadow: '0px 0px 15px #301E4E1A',
            '&::before': {
              opacity: 1 // force it to stay visible
            }
          }
        }}
      >
        <AccordionSummary
          sx={{
            height: 60,
            minHeight: 60,
            padding: { xs: '16px', md: '20px' },
            '& .MuiAccordionSummary-content': {
              margin: 0
            },
            '&.Mui-expanded': {
              background: theme.palette.company.background,
              height: 60,
              minHeight: 60
            }
          }}
          expandIcon={
            expanded === section.id ? (
              <Box
                sx={{
                  background: theme.palette.company.primary,
                  height: '30px',
                  width: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '5px'
                }}
              >
                <ClearRoundedIcon size={'18px'} style={{ color: theme.palette.company.background }} />
              </Box>
            ) : (
              <Box
                sx={{
                  background: theme.palette.company.background,
                  height: '30px',
                  width: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '5px'
                }}
              >
                <AddRoundedIcon size={'24px'} style={{ color: theme.palette.company.primary }} />
              </Box>
            )
          }
        >
          <Typography variant='body1Bold' sx={{ color: theme.palette.company.primary }}>
            {section.sectionName}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: { xs: '16px', md: '20px' },
            background: theme.palette.company.lightgradient
          }}
        >
          <Box
            sx={{
              border: '1px solid',
              borderColor: theme.palette.company.lightgrey,
              background: theme.palette.company.background,
              borderRadius: '8px'
            }}
          >
            {section.requirementDtoList &&
              section.requirementDtoList.length > 0 &&
              section.requirementDtoList.map((requirement, index) => {
                const routeLink =
                  page === 'framework'
                    ? `/home/governance/frameworks/${encrypt(frameworkId)}/automation/requirement/${encrypt(
                        requirement.id
                      )}`
                    : page === 'internalAudit'
                    ? `/home/compliance/internalAudits/${encrypt(frameworkId)}/requirement/${encrypt(
                        requirement.id
                      )}/controlTests`
                    : `/home/governance/frameworks/${encrypt(frameworkId)}/automation/requirement/${encrypt(
                        requirement.id
                      )}`

                return (
                  <Box
                    key={requirement.id}
                    sx={{
                      padding: { xs: '10px 16px', md: '10px 20px' },
                      borderBottom: index === section.requirementDtoList.length - 1 ? '' : '1px solid',
                      cursor: 'pointer',
                      borderColor: theme.palette.company.lightgrey,
                      '&:hover': {
                        background: `${theme.palette.company.lightgrey}30`
                      }
                    }}
                  >
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                      <Box>
                        <Typography
                          variant='body1Bold'
                          sx={{ color: theme.palette.company.lightprimary, cursor: 'pointer' }}
                          marginBottom={'10px'}
                          onClick={() => router.push(routeLink)}
                        >
                          {requirement.code}
                        </Typography>
                        <Typography variant='body2' sx={{ marginTop: '5px' }}>
                          {requirement.description}
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{ marginLeft: '20px' }}
                        titleAccess='Link Control'
                        onClick={() => router.push(routeLink)}
                      >
                        <LinkRoundedIcon
                          size={'24px'}
                          style={{ color: theme.palette.company.grey, transform: 'rotate(-45deg)' }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
