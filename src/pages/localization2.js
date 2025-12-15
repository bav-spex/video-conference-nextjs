import React from 'react'

import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import withRoot from './withRoot'

function Localization() {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  // document.body.dir = i18n.dir();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
    //   document.body.dir = i18n.dir();
    //   theme.direction = i18n.dir();
  }

  return (
    <div className='App'>
      {t('welcome')}
      <Button onClick={() => changeLanguage('en')}>en</Button>
      <Button onClick={() => changeLanguage('he')}>he</Button>
    </div>
  )
}

export default withRoot(Localization)
