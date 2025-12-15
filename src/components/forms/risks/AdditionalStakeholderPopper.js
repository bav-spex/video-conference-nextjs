import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import { Box, Fade, Paper, Popper, Typography } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material/styles'
import { withEnvPath } from 'utils/misc'

const AdditionalStakeholderPopper = ({
  openAdditionalStakeholderPopper,
  setOpenAdditionalStakeholderPopper,
  additionalstakeholders_dropdown,
  additionalstakeholdersMappingName,
  handleAdditionalStakeHoldersChange,
  additionalstakeholdersAnchorEl
}) => {
  const theme = useTheme()

  return (
    <Popper
      // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
      open={openAdditionalStakeholderPopper}
      anchorEl={additionalstakeholdersAnchorEl}
      placement={'top'}
      sx={{
        borderRadius: '5px',
        zIndex: 1200,
        width: additionalstakeholdersAnchorEl ? additionalstakeholdersAnchorEl.clientWidth + 4 : 'auto' // 👈 dynamic width
      }}
    >
      <ClickAwayListener onClickAway={() => setOpenAdditionalStakeholderPopper(false)}>
        <Paper>
          <Box sx={{ borderBottom: '1px solid', borderColor: theme.palette.company.lightgrey, padding: '10px' }}>
            <Typography variant='body1Bold'>Select Stakeholders</Typography>
          </Box>
          {additionalstakeholders_dropdown.length > 0 ? (
            additionalstakeholders_dropdown.map((item, index) => {
              return (
                <Box
                  key={item.id}
                  sx={{
                    cursor: 'pointer',
                    background: theme.palette.company.background,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    '&:hover': {
                      backgroundColor: theme.palette.company.tertiary
                    }
                  }}
                  onClick={() => handleAdditionalStakeHoldersChange(item.fullName)}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      color: additionalstakeholdersMappingName.includes(item.fullName)
                        ? theme.palette.company.primary
                        : theme.palette.company.text
                    }}
                  >
                    {item.fullName}
                  </Typography>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: additionalstakeholdersMappingName.includes(item.fullName)
                        ? theme.palette.company.primary
                        : theme.palette.company.background,
                      border: '1px solid',
                      borderColor: theme.palette.company.lightgrey,
                      borderRadius: '5px'
                    }}
                  >
                    {additionalstakeholdersMappingName.includes(item.fullName) && (
                      <CheckIcon
                        sx={{
                          width: '16px',
                          height: '16px',

                          color: theme.palette.company.background
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )
            })
          ) : (
            <Box
              sx={{
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <img
                alt='no result found'
                src={withEnvPath('/images/icons/WarningIcon.svg')}
                style={{ width: '40px', height: '40px' }}
              />
              <Typography variant='body2' sx={{ color: theme.palette.company.grey }}>
                No result found! Search other key word.
              </Typography>
            </Box>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  )
}

export default AdditionalStakeholderPopper
