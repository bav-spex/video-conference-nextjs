import React from 'react'

import { StylesProvider, jssPreset } from '@mui/styles'
import { create } from 'jss'
import rtl from 'jss-rtl'
// import i18n from "../../i18n/i18n";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] })

function withRoot(Component) {
  function WithRoot(props) {
    // JssProvider allows customizing the JSS styling solution.
    return (
      <StylesProvider jss={jss}>
        <Component {...props} />
      </StylesProvider>
    )
  }

  return WithRoot
}

export default withRoot
