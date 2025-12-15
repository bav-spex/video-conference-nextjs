import { createTheme } from '@mui/material'
import breakpoints from 'theme/breakpoints'
import buttons from 'theme/buttons'
import colors from 'theme/colors'
import globalStyles from 'theme/globalStyles'
import inputs from 'theme/inputs'
import spacing from 'theme/spacing'
import typography from 'theme/typography'

import dialog from './dialog'

export const getTheme = (company = 'light') => {
  const companyColors = colors[company] // light / dark / yellow / pink

  return createTheme({
    typography: typography(),
    breakpoints,
    ...spacing,
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            height: '44px',
            fontSize: '14px',
            padding: '10px 16px',
            color: companyColors.primary,
            background: companyColors.background,
            '&:hover': {
              background: companyColors.tertiary
            },
            '&.Mui-selected': {
              background: companyColors.tertiary,
              fontWeight: 'bold'
            }
          }
        }
      },
      ...buttons(company),
      ...dialog(company),
      ...inputs(company),
      // ✅ Apply global overrides here
      ...globalStyles
    },
    palette: {
      mode: company === 'dark' ? 'dark' : 'light', // ✅ changed from `type`
      primary: { main: companyColors.primary },
      secondary: { main: companyColors.secondary },
      background: { default: companyColors.background },
      text: { primary: companyColors.text },

      // ✅ custom palette extension
      company: {
        text: companyColors.text,
        primary: companyColors.primary,
        lightprimary: companyColors.lightprimary,
        secondary: companyColors.secondary,
        tertiary: companyColors.tertiary,
        lighttertiary: companyColors.lighttertiary,
        gradient: companyColors.gradient,
        lightgradient: companyColors.lightgradient,
        background: companyColors.background,
        lightgrey: companyColors.lightgrey,
        grey: companyColors.grey,
        tableHeaderBackground: companyColors.tableHeaderBackground
      }
    }
  })
}
