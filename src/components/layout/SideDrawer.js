import React, { useState, useEffect, useCallback } from 'react'

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined'
import { Box, Typography, Drawer } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import PermitForMainModuleContentOnly from 'components/PermitForMainModuleContentOnly'
// import PermitForModuleContentOnly from 'components/PermitForModuleContentOnly'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { markUI, selectIsSidebarOpen, selectIsMeetingStarted } from 'store/ui/uiSlice'
import { withEnvPath } from 'utils/misc'

const navItems = [
  {
    title: 'Home',
    link: '/dashboard',
    havePage: true,
    module: 'dashboard',
    icon: withEnvPath('/images/icons/GreyDashboardIcon.svg'),
    activeIcon: withEnvPath('/images/icons/WhiteDashboardIcon.svg'),
    isNested: false,
    children: []
  },

  {
    title: 'Host',
    link: '/host',
    havePage: false,
    module: 'governance',
    icon: withEnvPath('/images/icons/GreyGovernanceIcon.svg'),
    activeIcon: withEnvPath('/images/icons/WhiteGovernanceIcon.svg'),
    isNested: true,
    children: [
      {
        title: 'Create Meeting',
        link: '/host/createMeeting',
        module: 'createMeeting',
        mainModule: 'host',
        icon: withEnvPath('/images/icons/DashboardIcon.svg'),
        activeIcon: withEnvPath('/images/icons/DashboardIcon.svg'),
        isNested: false,
        children: []
      }
    ]
  },
  {
    title: 'Attendee',
    link: '/attendee',
    havePage: false,
    module: 'attendee',
    icon: withEnvPath('/images/icons/GreyGovernanceIcon.svg'),
    activeIcon: withEnvPath('/images/icons/WhiteGovernanceIcon.svg'),
    isNested: true,
    children: [
      {
        title: 'Join Meeting',
        link: '/attendee/joinMeeting',
        module: 'joinMeeting',
        mainModule: 'governance',
        icon: withEnvPath('/images/icons/DashboardIcon.svg'),
        activeIcon: withEnvPath('/images/icons/DashboardIcon.svg'),
        isNested: false,
        children: []
      }
    ]
  }
]

// ---------------- NavSubModule ----------------
const NavSubModule = ({ navItem, location }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const theme = useTheme()
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)
  const isMeetingStarted = useAppSelector(selectIsMeetingStarted)

  const isActive = location.pathname.includes(navItem.link)

  return (
    <>
      {navItem.isNested ? (
        <></>
      ) : (
        <Box
          sx={{
            p: '10px 20px 10px 52px',
            cursor: 'pointer',
            borderRadius: '5px',
            background: isActive ? theme.palette.company.tertiary : theme.palette.company.background,
            '&:hover': {
              color: isActive ? '' : theme.palette.company.background,
              background: isActive ? '' : theme.palette.company.lightgradient
            }
          }}
          onClick={() => {
            if (!isMeetingStarted) {
              dispatch(markUI({ menuName: navItem.mainModule }))
              dispatch(markUI({ subMenuName: navItem.module }))
              router.push(navItem.link)
            } else {
              toast.error('To go onto other page please leave the meeting')
            }
          }}
        >
          {isSidebarOpen && (
            <Typography style={{ color: isActive ? theme.palette.company.primary : theme.palette.company.text }}>
              {navItem.title}
            </Typography>
          )}
        </Box>
      )}
    </>
  )
}

// ---------------- NavModule ----------------
const NavModule = ({ navItem, openModule, setOpenModule, translate }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const theme = useTheme()
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)
  const isMeetingStarted = useAppSelector(selectIsMeetingStarted)

  const isActive = location.pathname.includes(navItem.link)

  return (
    <>
      {navItem.isNested ? (
        // <PermitForMainModuleContentOnly subModules={navItem.children?.map(item => item.module)} key={navItem.module}>
        <Box>
          <Box
            sx={{
              p: isSidebarOpen ? '10px 20px' : '10px 1px',
              mb: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarOpen ? 'space-between' : 'center',
              borderRadius: '5px',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isActive
                ? theme.palette.company.background
                : openModule === navItem.module
                ? theme.palette.company.primary
                : theme.palette.company.background,
              background: isActive ? theme.palette.company.gradient : theme.palette.company.background,
              '&:hover': {
                color: isActive ? '' : theme.palette.company.background,
                background: isActive ? '' : `${theme.palette.company.lightgradient}`
              }
            }}
            onClick={() => {
              if (!isMeetingStarted) {
                if (navItem.havePage) {
                  dispatch(markUI({ menuName: navItem.mainModule }))
                  dispatch(markUI({ subMenuName: navItem.module }))
                  router.push(navItem.link)
                }
                setOpenModule(openModule === navItem.module ? '' : navItem.module)
              } else {
                toast.error('To go onto other page please leave the meeting')
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={isActive ? navItem.activeIcon : navItem.icon}
                alt={navItem.title}
                style={{ marginRight: isSidebarOpen ? '10px' : '0px', width: '24px', height: '24px' }}
              ></img>
              {isSidebarOpen && (
                <Typography style={{ color: isActive ? theme.palette.company.background : theme.palette.company.text }}>
                  {navItem.title}
                </Typography>
              )}
            </Box>
            {isSidebarOpen &&
              (openModule === navItem.module ? (
                <KeyboardArrowUpOutlinedIcon
                  style={{ color: isActive ? theme.palette.company.background : theme.palette.company.text }}
                />
              ) : (
                <KeyboardArrowDownOutlinedIcon
                  style={{ color: isActive ? theme.palette.company.background : theme.palette.company.text }}
                />
              ))}
          </Box>
          {isSidebarOpen && openModule === navItem.module && (
            <>
              {navItem.children?.map(nestedItem => (
                // <PermitForModuleContentOnly module={nestedItem.module} key={nestedItem.module}>
                <NavSubModule
                  key={nestedItem.tabAlternativeName}
                  translate={translate}
                  navItem={nestedItem}
                  location={location}
                />
                // </PermitForModuleContentOnly>
              ))}
            </>
          )}
        </Box>
      ) : (
        // </PermitForMainModuleContentOnly>
        // <PermitForMainModuleContentOnly subModules={[navItem.module]} key={navItem.module}>
        // <PermitForModuleContentOnly module={navItem.module} key={navItem.module}>
        <Box
          sx={{
            p: isSidebarOpen ? '10px 20px' : '10px 2px',
            mb: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarOpen ? '' : 'center',
            borderRadius: '5px',
            border: '1px solid',
            borderColor: theme.palette.company.background,
            cursor: 'pointer',
            background: isActive ? theme.palette.company.gradient : theme.palette.company.background,
            '&:hover': {
              color: isActive ? '' : theme.palette.company.background,
              background: isActive ? '' : `${theme.palette.company.lightgradient}`
            }
          }}
          onClick={() => {
            if (!isMeetingStarted) {
              dispatch(markUI({ menuName: navItem.module }))
              dispatch(markUI({ subMenuName: '' }))
              router.push(navItem.link)
            } else {
              toast.error('To go onto other page please leave the meeting')
            }
          }}
        >
          <img
            src={isActive ? navItem.activeIcon : navItem.icon}
            alt={navItem.title}
            style={{ marginRight: isSidebarOpen ? '10px' : '0px', width: '24px', height: '24px' }}
          ></img>
          {isSidebarOpen && (
            <Typography style={{ color: isActive ? theme.palette.company.background : theme.palette.company.text }}>
              {navItem.title}
            </Typography>
          )}
        </Box>
        // </PermitForModuleContentOnly>
        // </PermitForMainModuleContentOnly>
      )}
    </>
  )
}

// ---------------- SideDrawerContent ----------------
const SideDrawerContent = ({ navItems, translate }) => {
  const theme = useTheme()
  const [openModule, setOpenModule] = useState('')
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenModule('')
    }
  }, [isSidebarOpen])

  return (
    <>
      {/* Logo */}
      <Box
        sx={{
          width: '100%',
          padding: isSidebarOpen ? '20px 20px 30px' : '20px 5px 30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isSidebarOpen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '60px' }}>
            <img
              style={{ width: '60px', hight: '60px' }}
              alt={process.env.NEXT_PUBLIC_COMPANY}
              src={withEnvPath('/images/logo.png')}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '60px' }}>
            <img
              style={{ width: '30px', hight: '60px' }}
              alt={process.env.NEXT_PUBLIC_COMPANY}
              src={withEnvPath('/images/logo.png')}
            />
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box style={{ width: '100%', padding: isSidebarOpen ? '0px 8px 80px 8px' : '0px 8px' }}>
        {navItems.map(item => (
          <NavModule
            key={item.module}
            translate={translate}
            navItem={item}
            openModule={openModule}
            setOpenModule={setOpenModule}
          />
        ))}
      </Box>

      {/* Bottom Buttons */}
      {isSidebarOpen && (
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            height: 60,
            width: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.palette.company.tertiary
          }}
        >
          {/* <Typography variant='body2'>Powered by</Typography> */}
          {/* <img alt='9USRcraftLogo' src='/images/9USRcraftLogo.png' /> */}
        </Box>
      )}
    </>
  )
}

// ---------------- SideDrawer ----------------
const SideDrawer = ({ isStick, setIsStick }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)

  const handleToggle = useCallback(() => {
    dispatch(markUI({ isSidebarOpen: !isSidebarOpen }))
  }, [dispatch])

  const handleOpen = useCallback(() => {
    dispatch(markUI({ isSidebarOpen: true }))
  }, [dispatch])

  const handleClose = useCallback(() => {
    dispatch(markUI({ isSidebarOpen: false }))
  }, [dispatch])

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        height: '100vh',
        overflowY: 'auto',
        transition: 'all 0.25s ease-in-out',
        boxShadow: '1px 0 20px rgba(0,0,0,0.08)',
        width: isSidebarOpen ? '300px' : '62px',
        minWidth: isSidebarOpen ? '300px' : '62px',
        maxWidth: isSidebarOpen ? '300px' : '62px'
      }}
      bgcolor={`${theme.palette.company.background}`}
      onMouseOver={() => handleOpen()} // Expand on hover
      onMouseLeave={() => !isStick && handleClose(false)} // Collapse if not open
    >
      <Drawer
        variant='persistent'
        open={true}
        // onClose={handleToggle}
        PaperProps={{
          style: {
            width: isSidebarOpen ? '300px' : '62px',
            background: theme.palette.company.background,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            borderRight: '0px',
            visibility: 'initial',
            transform: isSidebarOpen ? '' : 'translateX(0px) !important'
          }
        }}
      >
        {isSidebarOpen && (
          <Box
            sx={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: theme.palette.company.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: '10px',
              right: '10px'
            }}
            onClick={() => {
              setIsStick(!isStick)
              handleToggle()
            }}
          >
            {isStick && (
              <Box
                sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '12px',
                  background: theme.palette.company.primary
                }}
              ></Box>
            )}
          </Box>
        )}
        <SideDrawerContent
          navItems={navItems} // make sure to pass navItems from parent
          translate={{}} // same for translations
        />
      </Drawer>
    </Box>
  )
}

export default SideDrawer
