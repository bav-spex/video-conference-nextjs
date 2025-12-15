import { Box, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const FrameworkProgressBar = ({ title, value, color }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} md1={4}>
      <Box mb={'5px'} display={'flex'} alignItems={'flex-end'} justifyContent={'space-between'}>
        <Typography variant='body2'>{title}</Typography>
        <Typography variant='body2' fontWeight={600} fontSize={'14px'}>{`${value}%`}</Typography>
      </Box>
      <Box
        minHeight={'9px'}
        padding={'1px'}
        backgroundColor={theme.palette.company.background}
        border={'1px solid'}
        borderColor={`${theme.palette.company.lightgrey}80`}
        w={'100%'}
        borderRadius={'20px'}
        overflow={'hidden'}
      >
        <Box borderRadius={'20px'} maxWidth={`${value}%`} minHeight={'5px'} backgroundColor={color}></Box>
      </Box>
    </Grid>
  )
}

export default FrameworkProgressBar
