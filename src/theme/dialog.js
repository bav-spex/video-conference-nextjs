import colors from 'theme/colors'

const dialog = company => {
  const palette = colors[company]

  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: '10px solid',
          borderColor: palette.secondary,
          background: palette.background,
          color: palette.text,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '30px',
          // borderBottom: `1px solid ${palette.lightgrey}`,
          color: palette.primary
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {}
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'space-between',
          borderColor: palette.lightgrey
        }
      }
    }
  }
}

export default dialog
