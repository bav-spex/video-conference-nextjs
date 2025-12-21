import { useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import authConfig from 'configs/auth'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { getAllNotifications } from 'services/common'
import { useAuth } from 'store/auth/AuthContext'
import {
  markUI,
  selectColorThemeMode,
  selectIsSidebarOpen,
  selectLanguage,
  selectNotificationReceived
} from 'store/ui/uiSlice'

import AuthDisplayArea from './AuthDisplayArea'
import DisplayArea from './DisplayArea'
import SideDrawer from './SideDrawer'

const Layout = ({ children }) => {
  const colorThemeMode = useAppSelector(selectColorThemeMode)
  const theme = useTheme()
  const dispatch = useDispatch()
  const language = useAppSelector(selectLanguage)
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen)
  const { claims } = useAuth()
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  const [isStick, setIsStick] = useState(true)

  useEffect(() => {
    getAllNotifications(res => {
      dispatch(markUI({ notifications: res }))
      dispatch(markUI({ notificationReceived: true }))
    })
  }, [])

  const login = JSON.parse(localStorage.getItem('login'))
  console.log('login====>', login)

  return (
    <Box
      display='flex'
      bgcolor={`${colorThemeMode}_background`}
      minHeight='100vh'
      position='relative'
      overflow={'hidden'}
      dir={language === 'ar' || language === 'il' ? 'rtl' : 'ltr'}
    >
      {login === 'true' ? (
        <>
          <SideDrawer isStick={isStick} setIsStick={setIsStick} />
          <Box
            style={{
              width: '100%',
              minHeight: '100vh',
              overflow: 'hidden',
              background: theme.palette.company.tertiary,
              marginLeft: isStick ? (isSidebarOpen ? '300px' : '62px') : '62px',
              transition: 'margin-left 0.3s ease',
              position: 'relative'
            }}
          >
            <DisplayArea>{children}</DisplayArea>
          </Box>
        </>
      ) : (
        <Box width='100%' bgcolor={`${colorThemeMode}_tertiary`} minHeight='100%'>
          <AuthDisplayArea>{children}</AuthDisplayArea>
        </Box>
      )}
    </Box>
  )
}

export default Layout
