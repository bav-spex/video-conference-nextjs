import { Box } from '@mui/material'
import { useAppSelector } from 'hooks/hooks'
import { useDeviceDetection } from 'hooks/useDeviceDetection'
import { selectColorThemeMode } from 'store/ui/uiSlice'

const DisplayArea = ({ children }) => {
  const colorThemeMode = useAppSelector(selectColorThemeMode)

  return (
    <Box
      style={{
        width: '100%',
        height: '100vh', // 100vh minus topbar height
        overflowY: 'hidden'
      }}
      className='scrollDiv'
    >
      {children}
    </Box>
  )
}

export default DisplayArea
