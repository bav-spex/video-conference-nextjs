// theme/colors.js
const colors = {
  light: {
    text: '#212529',
    primary: '#009EFB',
    lightPrimary: '#cfecfe',
    secondary: '#54667A',
    tertiary: '#f2f7f8',
    gradient: 'linear-gradient(to right, #0178BC 0%, #00BDDA 100%)',
    background: '#ffffff'
  },
  dark: {
    text: '#b2b9bf',
    primary: '#001f31',
    secondary: '#C1DAF5',
    tertiary: '#323743',
    gradient: 'linear-gradient(to right, #001F31 0%, #0088D6 100%)',
    background: '#272b34'
  },
  [process.env.NEXT_PUBLIC_COMPANY]: {
    text: '#18171A',
    primary: '#301E4E',
    lightprimary: '#483764',
    secondary: '#F2A1A0',
    tertiary: '#F5F3F8',
    lighttertiary: '#f8f6fb',
    gradient: 'linear-gradient(135deg, #d16ba5, #4b2068)',
    lightgradient: 'linear-gradient(135deg, #d16ba550, #4b206850)',
    background: '#ffffff',
    lightgrey: '#D9D5E3',
    grey: '#85828B',
    tableHeaderBackground: '#D9D5E3'
  }
}

export default colors
