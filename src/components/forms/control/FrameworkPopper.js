import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import { Box, Paper, Popper, Typography } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material/styles'
import { withEnvPath } from 'utils/misc'

const FrameworkPopper = ({
  openFrameworkPopper,
  setOpenFrameworkPopper,
  framework_dropdown,
  frameworkMappingName,
  handleFrameworkChange,
  frameworkAnchorEl
}) => {
  const theme = useTheme()

  return (
    <Popper
      open={openFrameworkPopper}
      anchorEl={frameworkAnchorEl}
      placement='top'
      sx={{
        borderRadius: '5px',
        zIndex: 1200,
        width: frameworkAnchorEl ? frameworkAnchorEl.clientWidth + 4 : 'auto'
      }}
    >
      <ClickAwayListener onClickAway={() => setOpenFrameworkPopper(false)}>
        <Paper>
          <Box sx={{ borderBottom: '1px solid', borderColor: theme.palette.company.lighgrey, padding: '10px' }}>
            <Typography variant='body1Bold'>Select Framework</Typography>
          </Box>
          {framework_dropdown.length > 0 ? (
            framework_dropdown.map(item => (
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
                onClick={() => handleFrameworkChange(item.framework_Name)}
              >
                <Typography
                  variant='body1'
                  sx={{
                    color: frameworkMappingName.includes(item.framework_Name)
                      ? theme.palette.company.primary
                      : theme.palette.company.text
                  }}
                >
                  {item.framework_Name}
                </Typography>
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: frameworkMappingName.includes(item.framework_Name)
                      ? theme.palette.company.primary
                      : theme.palette.company.background,
                    border: '1px solid',
                    borderColor: theme.palette.company.lighgrey,
                    borderRadius: '5px'
                  }}
                >
                  {frameworkMappingName.includes(item.framework_Name) && (
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
            ))
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
                No result found! Try another keyword.
              </Typography>
            </Box>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  )
}

export default FrameworkPopper
