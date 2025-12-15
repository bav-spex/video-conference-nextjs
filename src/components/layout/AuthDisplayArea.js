import { Box } from '@mui/material'
import { useAppSelector } from 'hooks/hooks'
import { selectColorThemeMode } from 'store/ui/uiSlice'

const AuthDisplayArea = ({ children }) => {
  const colorThemeMode = useAppSelector(selectColorThemeMode)

  return (
    <Box
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: `${colorThemeMode}_tertiary`,
        color: `${colorThemeMode}_text`
      }}
    >
      {children}
    </Box>
  )
}

export default AuthDisplayArea
