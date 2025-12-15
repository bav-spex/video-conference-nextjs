import { Box } from '@mui/material'

const CommonBox = ({ children, ...props }) => {
  return (
    <Box
      style={{
        width: '100%',
        padding: '0px 30px'
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default CommonBox
