import { CircularProgress, Typography, Box } from '@mui/material'

const CircularProgressWithLabel = ({ value, color }) => {
  return (
    <Box position='relative' display='inline-flex'>
      {/* Background circle (grey track) */}
      <CircularProgress
        variant='determinate'
        value={100}
        size={120}
        thickness={10}
        sx={{
          color: '#e0e0e0'
        }}
      />

      {/* Foreground progress circle */}
      <CircularProgress
        variant='determinate'
        value={value}
        size={120}
        thickness={10}
        sx={{
          color: color,
          position: 'absolute',
          left: 0
        }}
      />

      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography variant='h6' component='div' color='black' fontWeight='bold'>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

export default CircularProgressWithLabel
