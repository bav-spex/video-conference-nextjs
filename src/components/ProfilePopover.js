import React, { useState } from 'react'

import { Avatar, Popover, Typography, Divider } from '@mui/material'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useAuth } from 'store/auth/AuthContext'

export default function ProfilePopover() {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const router = useRouter()
  const { logout, user } = useAuth()

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleClick = link => {
    if (link === 'logout') {
      localStorage.clear()
      logout()
      handleClose()
    } else {
      router.push(link)
      handleClose()
    }
  }
  const login = JSON.parse(localStorage.getItem('login'))
  console.log('login====>', login)

  return (
    <>
      {/* Avatar  to trigger popover */}
      {login && login === 'true' && (
        <>
          <Avatar
            sx={{
              cursor: 'pointer',
              backgroundColor: theme.palette.company.secondary,
              width: { xs: '30px', md: '40px' },
              height: { xs: '30px', md: '40px' },
              fontSize: { xs: '16px', md: '24px' },
              border: `3px solid ${theme.palette.company.primary}`
            }}
            onClick={handleOpen}
          >
          A
            {/* {user?.firstName?.charAt(0).toUpperCase() ?? user?.userName?.charAt(0).toUpperCase() ?? 'U'} */}
          </Avatar>

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
              sx: {
                borderRadius: '5px',
                padding: '0px',
                minWidth: 220
              }
            }}
          >
            {/* User Info */}
            <Box sx={{ padding: { xs: '10px 16px', md: '15px 24px' } }}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, mb: '5px', color: theme.palette.company.text }}>
                A
                {/* {user?.userName[0].toUpperCase() + user.userName.slice(1)} */}
              </Typography>
              {/* <Typography sx={{ fontSize: 13, color: '#666' }}>
                {' '}
                {user?.role[0].toUpperCase() + user.role.slice(1)}
              </Typography> */}
            </Box>

            <Divider />

            {/* Menu Items */}
            <Box sx={{ padding: '12px' }}>
              {[
                // { title: 'Profile', link: '/profile' },
                {
                  title: 'Logout',
                  link: 'logout'
                }
              ].map(item => {
                return (
                  <Box
                    key={item.link}
                    sx={{
                      p: { xs: '10px 16px', md: '15px 24px' },
                      cursor: 'pointer',
                      borderRadius: '5px',

                      background: theme.palette.company.background,
                      '&:hover': {
                        color: theme.palette.company.background,
                        background: theme.palette.company.tertiary
                      }
                    }}
                    onClick={() => {
                      handleClick(item.link)
                    }}
                  >
                    <Typography sx={{ color: theme.palette.company.text }}>{item.title}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Popover>
        </>
      )}
    </>
  )
}
