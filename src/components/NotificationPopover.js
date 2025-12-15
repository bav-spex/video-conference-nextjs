import React, { useEffect, useState } from 'react'

import { Avatar, Popover, Typography, Divider, CircularProgress } from '@mui/material'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { formatDistanceToNow } from 'date-fns'
import { useAppSelector } from 'hooks/hooks'
import { useRouter } from 'next/router'
import { getAllNotifications } from 'services/common'
import { selectNotifications } from 'store/ui/uiSlice'
import { withEnvPath } from 'utils/misc'
import { encrypt } from 'utils/routingEncryption'

export default function NotificationPopover() {
  const theme = useTheme()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const notifications = useAppSelector(selectNotifications)
  const [sortedNotifications, setSortedNotifications] = useState([])

  useEffect(() => {
    if (notifications) {
      setSortedNotifications([...notifications].sort((a, b) => new Date(b.createAt) - new Date(a.createAt)))
    }
  }, [notifications])

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleClick = notification => {
    const type = notification.type.toLowerCase()
    const entityId = notification.entityId

    if (type.includes('risk')) {
      router.push(`/home/riskManagement/risks/edit/${encrypt(entityId)}`)
    } else if (type.includes('frameworks')) {
      router.push('/home/governance/frameworks')
    } else if (type.includes('control')) {
      router.push(`/home/governance/controls/edit/${encrypt(entityId)}`)
    } else if (type.includes('policy')) {
      router.push(`/home/governance/documents/edit/${encrypt(entityId)}`)
    } else if (type.includes('asset')) {
      router.push(`/home/riskManagement/assets/edit/${encrypt(entityId)}`)
    } else if (type.includes('internal audit')) {
      router.push('/home/compliance/internalAssesment')
    } else if (type.includes('audit')) {
      router.push(`/home/compliance/audits/edit/${entityId}`)
    } else {
      console.log('Not valid message')
    }

    handleClose()
  }

  const hasUnread = sortedNotifications.some(notification => notification.status?.toLowerCase() === 'unread')

  return (
    <>
      {/* Avatar  to trigger popover */}

      <>
        <Box
          sx={{
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={e => handleOpen(e)}
        >
          {hasUnread ? (
            <>
              <img src={withEnvPath('/images/icons/NotificationIcon.svg')} alt='notification' />
            </>
          ) : (
            <img src={withEnvPath('/images/icons/NotificationBell.svg')} alt='notification' />
          )}
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
            sx: {
              borderRadius: '5px',
              padding: '0px',
              minWidth: '250px',
              maxWidth: '320px',
              overflow: 'hidden'
            }
          }}
        >
          <Box
            sx={{
              padding: { xs: '10px 16px', md: '15px 24px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: '5px', color: theme.palette.company.text, mr: 3 }}>
              Notifications
            </Typography>
            <Typography
              sx={{
                cursor: 'pointer',
                mb: '5px',
                fontSize: '14px',
                color: theme.palette.company.primary,
                '&:hover': {
                  color: theme.palette.company.secondary
                }
              }}
              onClick={() => {
                router.push({
                  pathname: '/profile',
                  query: { tab: 'notification' }
                })
                handleClose()
              }}
            >
              See all notifications
            </Typography>
          </Box>
          <Divider />

          {/* Menu Items */}
          <Box className='scrollDiv' sx={{ maxHeight: '350px', overflowY: 'scroll' }}>
            <>
              {sortedNotifications
                .filter(notification => notification.status?.toLowerCase() === 'unread')
                .slice(0, 10)
                .map((notification, index) => {
                  const isUnread = notification.status.toLowerCase() === 'unread'

                  return (
                    <>
                      {index !== 0 && <Divider />}
                      <Box
                        key={notification.link}
                        sx={{
                          p: { xs: '10px 16px', md: '15px 24px' },
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          background: theme.palette.company.background,
                          '&:hover': {
                            background: theme.palette.company.tertiary
                          }
                        }}
                        onClick={() => {
                          handleClick(notification)
                        }}
                      >
                        <Box
                          component='img'
                          src={withEnvPath('/images/icons/NotificationBell.svg')}
                          alt='bell icon'
                          sx={{ width: 24, height: 24 }}
                        />

                        <Box sx={{ marginLeft: '10px' }}>
                          <Typography sx={{ fontSize: '16px', fontWeight: isUnread ? 500 : 400 }} noWrap>
                            {notification.type}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.company.text,
                              fontSize: '14px'
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography sx={{ marginTop: 0.5, fontSize: '14px', color: '#85828B' }}>
                            {formatDistanceToNow(new Date(notification.createAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                        {/* <Typography sx={{ color: theme.palette.company.text }}>{notification.title}</Typography> */}
                      </Box>
                    </>
                  )
                })}
            </>
          </Box>
        </Popover>
      </>
    </>
  )
}
