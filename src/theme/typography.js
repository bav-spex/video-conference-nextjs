import colors from 'theme/colors'

const typography = () => {
  const company = process.env.NEXT_PUBLIC_COMPANY
  const palette = colors[company]

  return {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    color: palette.text,
    h1: {
      fontSize: '2rem', //32px
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 700
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600
    },
    h4: {
      fontSize: '1.25rem', //20px
      fontWeight: 600
    },
    h5: {
      fontSize: '1.125rem', //18px
      fontWeight: 600
    },
    h5Medium: {
      fontSize: '1.125rem', //18px
      fontWeight: 500
    },
    h5Light: {
      fontSize: '1.125rem', //18px
      fontWeight: 400
    },
    body1Bold: {
      fontSize: '1rem',
      fontWeight: 600
    },
    body1Medium: {
      fontSize: '1rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400
    },
    button: {
      textTransform: 'none', // Disable uppercase
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  }
}

export default typography
