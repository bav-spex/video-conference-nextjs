import React, { useEffect, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import authConfig from 'configs/auth'
import { useRouter } from 'next/router'
import apiHelper from 'store/apiHelper'
import { useAuth } from 'store/auth/AuthContext'
import { withEnvPath } from 'utils/misc'

const OrganisationPage = () => {
  const router = useRouter()
  const { setLoading, user, setUser } = useAuth()
  const orgData = JSON.parse(localStorage.getItem('organisationsData'))

  const [organisationsData, setOrganisationsData] = useState(orgData)

  const redirectToOrganisation = orgId => {
    if (orgId == user.currentorg) {
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' && returnUrl !== '/home' ? returnUrl : '/dashboard'
      router.replace(redirectURL)
    } else {
      apiHelper(`${authConfig.authDevRakshitah_base_url}authenticate/me?orgId=${orgId}`, 'get', null, {})
        .then(response => {
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          setUser({ ...user, currentorg: orgId })
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' && returnUrl !== '/home' ? returnUrl : '/dashboard'
          router.replace(redirectURL)
        })
        .catch(err => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setLoading(false)
          // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          //   router.replace('/login')
          // }
        })
    }
  }

  return (
    <div>
      <Typography mb={'10px'} variant='h6' fontWeight={600}>
        Organisation
      </Typography>
      <Grid container spacing={6} className='match-height'>
        {organisationsData &&
          organisationsData.map(org => {
            return (
              <Grid key={org.orgName} item xs={12} sm={6} lg={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box
                        bgcolor={'#301e4e'}
                        width={'40px'}
                        height={'40px'}
                        borderRadius={'50px'}
                        border={'2px solid #fff'}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        <Typography color={'#fff'} fontSize={'20px'} fontWeight={500}>
                          {org.orgName[0]}
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{ color: 'text.secondary' }}
                        onClick={() => redirectToOrganisation(org.parentOrgId)}
                      >
                        {/* <Icon icon='mdi:arrow-right' fontSize={30} /> */}

                        <Box
                          component='img'
                          src={withEnvPath('/images/icons/ArrowRightIcon.svg')}
                          alt='bell icon'
                          sx={{ width: 18, height: 18 }}
                        />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='h6'>{org.orgName}</Typography>
                    </Box>
                    <Typography variant='p'>{org.orgDescription}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
      </Grid>
    </div>
  )
}
OrganisationPage.guestGuard = true

export default OrganisationPage
