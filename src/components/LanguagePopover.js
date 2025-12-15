import React, { useState } from 'react'

import { Popover, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { withEnvPath } from 'utils/misc'

export default function LanguagePopover() {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleClick = lng => {
    i18n.changeLanguage(lng)
    handleClose()
  }

  return (
    <>
      {/* Avatar  to trigger popover */}

      <>
        <Box sx={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={e => handleOpen(e)}>
          <img src={withEnvPath('/images/icons/LanguageIcon.svg')} alt='language' />
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{
            style: {
              borderRadius: '5px',
              padding: '0px',
              minWidth: 220
            }
          }}
        >
          {/* Menu Items */}
          <Box style={{ padding: '12px' }}>
            {[
              { title: 'English', lng: 'en' },
              { title: 'हिंदी', lng: 'he' }
            ].map(item => {
              return (
                <Box
                  key={item.lng}
                  sx={{
                    p: '10px 24px 10px',
                    cursor: 'pointer',
                    borderRadius: '5px',

                    background: theme.palette.company.background,
                    '&:hover': {
                      color: theme.palette.company.background,
                      background: theme.palette.company.tertiary
                    }
                  }}
                  onClick={() => {
                    handleClick(item.lng)
                  }}
                >
                  <Typography style={{ color: theme.palette.company.text }}>{item.title}</Typography>
                </Box>
              )
            })}
          </Box>
        </Popover>
      </>
    </>
  )
}
