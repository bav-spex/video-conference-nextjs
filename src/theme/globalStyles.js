// theme/globalStyles.js
const globalStyles = {
  MuiCssBaseline: {
    '@global': {
      body: {
        fontFamily: 'Inter, sans-serif',
        color: '#000000',
        lineHeight: '1.2',
        minWidth: '0px'
      },
      '*::placeholder': {
        color: '#818181'
      },
      '*, *::before, *::after': {
        wordWrap: 'break-word',
        boxSizing: 'border-box',
        border: 'none'
      },
      '*': {
        minWidth: '0px'
      },
      a: {
        color: 'blue'
      }
    }
  }
}

export default globalStyles
