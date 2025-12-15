// ** MUI Import
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { withEnvPath } from 'utils/misc'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img style={{ width: '200px', height: '200px' }} alt='loader image' src={withEnvPath('/images/logo.png')} />
      <CircularProgress disableShrink sx={{ mt: 6, color: theme.palette.company.primary }} />
    </Box>
  )
}

export default FallbackSpinner
