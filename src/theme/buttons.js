import colors from 'theme/colors'

const buttons = () => {
  const company = process.env.NEXT_PUBLIC_COMPANY
  const palette = colors[company]

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          textTransform: 'none',
          fontWeight: 600,
          color: palette.primary,
          background: palette.secondary,
          margin: '5px 5px',
          padding: '5px 16px'
        }
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            background: palette.secondary,
            color: palette.primary,
            margin: '0px',
            padding: 'auto',
            '&:hover': {
              background: palette.tertiary
            }
          }
        },
        {
          props: { variant: 'secondary' },
          style: {
            background: palette.primary,
            color: palette.background,
            margin: '0px',
            padding: 'auto',
            '&:hover': {
              background: palette.lightprimary
            },
            '&:disabled': {
              background: palette.lightgrey
            }
          }
        },
        {
          props: { variant: 'outlined' },
          style: {
             background: palette.background,
            borderColor: palette.primary,
            color: palette.primary,
            '&:hover': {
              background: palette.tertiary
            }
          }
        },
        {
          props: { variant: 'text' },
          style: {
            color: palette.primary,
            '&:hover': {
              background: palette.lighttertiary || palette.tertiary
            }
          }
        }
      ]
    }
  }
}

export default buttons
