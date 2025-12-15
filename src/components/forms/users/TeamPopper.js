import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import { Box, Fade, Paper, Popper, Typography } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material/styles'
import { withEnvPath } from 'utils/misc'

const TeamPopper = ({
  openTeamPopper,
  setOpenTeamPopper,
  team_dropdown,
  teamMappingName,
  handleTeamChange,
  teamAnchorEl
}) => {
  const theme = useTheme()

  return (
    <Popper
      // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
      open={openTeamPopper}
      anchorEl={teamAnchorEl}
      placement={'top'}
      sx={{
        borderRadius: '5px',
        zIndex: 1200,
        width: teamAnchorEl ? teamAnchorEl.clientWidth + 4 : 'auto' // 👈 dynamic width
      }}
    >
      <ClickAwayListener onClickAway={() => setOpenTeamPopper(false)}>
        <Paper>
          <Box sx={{ borderBottom: '1px solid', borderColor: theme.palette.company.lightgrey, padding: '10px' }}>
            <Typography variant='body1Bold'>Select Team</Typography>
          </Box>
          {team_dropdown.length > 0 ? (
            team_dropdown.map((item, index) => {
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
                  onClick={() => handleTeamChange(item.teamName)}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      color: teamMappingName.includes(item.teamName)
                        ? theme.palette.company.primary
                        : theme.palette.company.text
                    }}
                  >
                    {item.teamName}
                  </Typography>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: teamMappingName.includes(item.teamName)
                        ? theme.palette.company.primary
                        : theme.palette.company.background,
                      border: '1px solid',
                      borderColor: theme.palette.company.lightgrey,
                      borderRadius: '5px'
                    }}
                  >
                    {teamMappingName.includes(item.teamName) && (
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

export default TeamPopper
