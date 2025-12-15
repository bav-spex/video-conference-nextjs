import React from 'react'

import { useTranslation } from 'react-i18next'

function Localization() {
  const { t, i18n } = useTranslation()
  // document.body.dir = i18n.dir();

  return <div className='App'>{t('welcome')}</div>
}

export default Localization
