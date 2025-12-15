import colors from 'theme/colors'

const inputs = () => {
  const company = process.env.NEXT_PUBLIC_COMPANY
  const palette = colors[company]

  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          backgroundColor: palette.background,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.grey
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.secondary,
            borderWidth: 2
          }
        },
        input: {
          color: palette.text,
          // fontSize:"16px"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.grey,
          '&.Mui-focused': {
            color: palette.primary
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          color: palette.tertiary
        }
      }
    }
  }
}

export default inputs
