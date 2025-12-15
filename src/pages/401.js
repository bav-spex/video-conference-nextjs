// ** Next Import
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// ** MUI Components
import Typography from '@mui/material/Typography'
import { styled } from '@mui/styles'
import DisplayArea from 'components/layout/DisplayArea'
import { withEnvPath } from 'utils/misc'

const Error401 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <DisplayArea>
          <Typography variant='h4'>Getting Ready</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            One moment, please
          </Typography>
        </DisplayArea>
        <img height='487' alt='error-illustration' src={withEnvPath('/images/pages/401.gif')} />
      </Box>
    </Box>
  )
}
Error401.getLayout = page => {
  page
}

export default Error401
