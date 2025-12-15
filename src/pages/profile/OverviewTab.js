import React, { useEffect } from 'react'
import { useState } from 'react'

import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { capitalize, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import authConfig from 'configs/auth'
import Assets from 'pages/profile/OverViewTab/Assets'
import Controls from 'pages/profile/OverViewTab/Controls'
import ExternalAudits from 'pages/profile/OverViewTab/ExternalAudits'
import InternalAudits from 'pages/profile/OverViewTab/InternalAudits'
import Policies from 'pages/profile/OverViewTab/Policies'
import Risks from 'pages/profile/OverViewTab/Risks'
import { getAllRoles, getTeamDropDown } from 'services/common'
import apiHelper from 'store/apiHelper'
import { getInitials } from 'utils/get-initials'

const extractData = (data, id, dataFieldName, fieldName) => {
  const team = data.find(t => t[dataFieldName] === id * 1)

  return team?.[fieldName] ?? ''
}

const OverviewTab = () => {
  const theme = useTheme()
  const user_data = JSON.parse(localStorage.getItem('userData'))
  const [userData, setUserData] = useState()
  const [team_dropdown, set_team_dropdown] = useState()
  const [role_dropdown, set_role_dropdown] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeamDropDown(set_team_dropdown, () => {})
    getAllRoles(set_role_dropdown, () => {})
    ;(async () => {
      await apiHelper(`${authConfig.authDevRakshitah_base_url}users/getById/${user_data.id}`, 'get')
        .then(res => {
          setUserData({
            ...res.data
          })
        })
        .catch(err => {
          console.log(err)
        })
    })()
  }, [])

  useEffect(() => {
    if (userData && team_dropdown && role_dropdown) {
      setLoading(false)
    }
  }, [userData, team_dropdown, role_dropdown])

  const [tab, setTab] = useState('Controls')

  return (
    <>
      {loading ? (
        <Box
          sx={{
            height: '20vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <CircularProgress disableShrink sx={{ mt: 6, color: theme.palette.company.primary }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              background: theme.palette.company.background,
              border: '1px solid',
              borderColor: theme.palette.company.lightgrey,
              padding: '30px 0px',
              m: '30px 30px',
              borderRadius: '5px'
            }}
          >
            <Grid container>
              <Grid item xs={12} md={4}>
                {' '}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    borderRight: '1px solid',
                    borderColor: theme.palette.company.lightgrey,
                    padding: '0px 30px'
                  }}
                >
                  <Box
                    sx={{
                      width: '70px',
                      height: '70px',
                      border: '5px solid',
                      borderColor: `${theme.palette.company.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '100px',
                      color: theme.palette.company.background,
                      background: theme.palette.company.primary
                    }}
                  >
                    <Typography variant='h3' fontWeight={400}>
                      {getInitials(userData.userName.toUpperCase())}
                    </Typography>
                  </Box>

                  <Typography variant='h5' sx={{ mt: '16px' }}>
                    {capitalize(userData.fullName)}
                  </Typography>
                  <Typography variant='body2' sx={{ mt: '5px', color: theme.palette.company.secondary }}>
                    {/* {capitalize(extractData(role_dropdown, userData.roleId[0], 'roleId', 'role'))} */}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ padding: '0px 30px' }}>
                  <Grid container spacing={4}>
                    {[
                      {
                        label: 'Username',
                        value: `@${userData?.userName}` || ''
                      },
                      {
                        label: 'Full Name',
                        value: userData.fullName
                      },
                      {
                        label: 'Email',
                        value: userData.emailId || ''
                      },
                      {
                        label: 'Role',
                        value: capitalize(extractData(role_dropdown, userData.roleId[0], 'roleId', 'role'))
                      },
                      {
                        label: 'Address',
                        value: userData.address || 'N/A'
                      },
                      {
                        label: 'Teams',
                        value: extractData(team_dropdown, userData.teams[0], 'id', 'teamName')
                      }
                    ].map(item => {
                      return (
                        <Grid key={item.label} item xs={12} md={6}>
                          {' '}
                          <Box>
                            <Typography variant='body1' sx={{ color: theme.palette.company.grey }}>
                              {item.label}
                            </Typography>
                            <Typography variant='body1Bold' sx={{ color: theme.palette.company.primary }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      {/*<Box>
        <TabContext value={tab}>
          <Tabs
            value={tab}
            onChange={(e, value) => setTab(value)}
            aria-label='basic tabs example'
            sx={{ padding: '0px 30px' }}
          >
            {[
              { title: 'Controls' },
              { title: 'Policies' },
              { title: 'Risks' },
              { title: 'Assets' },
              { title: 'Internal Audit' },
              { title: 'External Audit' }
            ].map(item => {
              return (
                <Tab key={item.title} className={tab === item.title ? '' : ''} label={item.title} value={item.title} />
              )
            })}
          </Tabs>
          <Box
            sx={{
              background: theme.palette.company.background,
              borderTop: '1px solid',
              borderColor: theme.palette.company.lightgrey
            }}
          >
            <TabPanel sx={{ padding: '0px' }} value='Controls'>
              <Controls />
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value='Policies'>
              <Policies />
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value='Risks'>
              <Risks />
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value='Assets'>
              <Assets />
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value='Internal Audit'>
              <InternalAudits />
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value='External Audit'>
              <ExternalAudits />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>*/}
    </>
  )
}

export default OverviewTab
