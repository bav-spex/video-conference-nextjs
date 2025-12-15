// ** MUI Imports
import { useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Topbar from 'components/Topbar'
import { useRouter } from 'next/router'

import NotificationTab from './NotificationTab'
import OverviewTab from './OverviewTab'
import SecurityTab from './SecurityTab'

const TABS_DATA = [
  { title: 'Overview', value: 'overview' },
  { title: 'Security', value: 'security' },
  { title: 'Notifications', value: 'notification' }
]

const Profile = () => {
  const router = useRouter()

  const { tab } = router.query
  const [activeTab, setActiveTab] = useState(TABS_DATA[0].value)
  const theme = useTheme()

  useEffect(() => {
    if (tab && TABS_DATA.some(t => t.value === tab)) {
      setActiveTab(tab)
    } else {
      setActiveTab('overview')
    }
  }, [tab])

  const handleChange = value => {
    setActiveTab(value)
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: value }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <Topbar hardSubmenuName={'Account Settings'} />
      <Box className={'displayAreaBlock scrollDiv'}>
        <Box sx={{ marginBottom: '-1px', background: theme.palette.company.tertiary, padding: '30px 30px 0px 30px' }}>
          {TABS_DATA.map(item => {
            return (
              <Button
                onClick={() => handleChange(item.value)}
                key={item.value}
                sx={{
                  color: theme.palette.company.primary,
                  padding: '5px 30px',
                  textAlign: 'center',
                  fontSize: '16px',
                  margin: '0px',
                  border: '1px solid',
                  borderRadius: '8px 8px 0px 0px',
                  background:
                    activeTab === item.value ? theme.palette.company.lighttertiary : theme.palette.company.tertiary,
                  borderColor:
                    activeTab === item.value ? theme.palette.company.lightgrey : theme.palette.company.tertiary,
                  borderBottomColor:
                    activeTab === item.value ? theme.palette.company.lighttertiary : theme.palette.company.lightgrey,
                  '&:hover': {
                    background: theme.palette.company.tertiary
                  }
                }}
              >
                {item.title}
              </Button>
            )
          })}
        </Box>
        <Box
          sx={{
            background: theme.palette.company.lighttertiary,
            borderTop: '1px solid',
            borderColor: theme.palette.company.lightgrey
          }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'notification' && <NotificationTab />}
        </Box>
      </Box>
    </>
  )
}

export default Profile
