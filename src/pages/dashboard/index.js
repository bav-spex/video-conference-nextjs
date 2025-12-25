import React from 'react'

import { Box, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Topbar from 'components/Topbar'

const Dashboard = () => {
  const theme = useTheme()

  return (
    <>
      <Topbar hardMenuName='Home' hardSubmenuName='Home'></Topbar>
      <Box className={'displayAreaBlock scrollDiv'} sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
        <Box
          backgroundColor={theme.palette.company.background}
          p={{ xs: '16px', md: '30px' }}
          boxShadow='0px 2px 10px 0px rgba(58, 53, 65, 0.1)'
          borderRadius='6px'
          height='50vh'
          display='flex'
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant='h1' textAlign={'center'}>
            Hello {process.env.NEXT_PUBLIC_COMPANY}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default Dashboard
