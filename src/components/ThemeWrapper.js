// components/ThemeWrapper.js
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useAppSelector } from 'hooks/hooks'
import { selectColorThemeMode } from 'store/ui/uiSlice'
import { getTheme } from 'theme'

const ThemeWrapper = ({ children }) => {
  const colorThemeMode = useAppSelector(selectColorThemeMode)
  const theme = getTheme(colorThemeMode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default ThemeWrapper
