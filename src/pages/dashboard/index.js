import React from 'react'

import { Box, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Topbar from 'components/Topbar'

const Dashboard = () => {
  const theme = useTheme()

  return (
    <>
      <Topbar />{' '}
      <Box className={'displayAreaBlock scrollDiv'} sx={{ padding: { xs: '16px 16px 78px', md: '30px' } }}>
        <Grid container spacing={{ xs: 4, md: 7.25 }}></Grid>
      </Box>
    </>
  )
}

export default Dashboard
