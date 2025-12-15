// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import MuiAvatar from '@mui/material/Avatar'

const Avatar = forwardRef((props, ref) => {
  const getAvatarStyles = (skin, skinColor) => {
    let avatarStyles

    avatarStyles = {
      color: '#ffffff',
      backgroundColor: '#e42dadff'
    }

    return avatarStyles
  }

  return <MuiAvatar ref={ref} {...props} />
})
Avatar.defaultProps = {
  skin: 'filled',
  color: 'primary'
}

export default Avatar
