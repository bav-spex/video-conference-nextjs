// ** Next Import
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// ** MUI Components
import Typography from '@mui/material/Typography'
import { styled } from '@mui/styles'
import DisplayArea from 'components/layout/DisplayArea'
import Link from 'next/link'
import { withEnvPath } from 'utils/misc'

const Error500 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <DisplayArea>
          <Typography variant='h1'>500</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Internal server error 👨🏻‍💻
          </Typography>
          <Typography variant='body2'>Oops, something went wrong!</Typography>
        </DisplayArea>
        <img height='487' alt='error-illustration' src={withEnvPath('/images/pages/500.png')} />
        <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}
Error500.getLayout = page => page

export default Error500
