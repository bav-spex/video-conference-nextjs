import React, { useEffect, useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { Drawer, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import useDebounce from 'hooks/useDebounce'
import { withEnvPath } from 'utils/misc'

const ServiceMappingDrawer = ({
  openServiceMappingDrawer,
  setOpenServiceMappingDrawer,
  service_dropdown,
  serviceMappingName,
  handleServiceChange
}) => {
  const theme = useTheme()
  const [serviceMappingSearch, setServiceMappingSearch] = useState('')
  const [filtered_service_dropdown, set_filtered__service_dropdown] = useState([])
  const debouncedServiceSearch = useDebounce(serviceMappingSearch, 500)

  useEffect(() => {
    if (service_dropdown) {
      set_filtered__service_dropdown(service_dropdown.filter(item => item.lookupName.includes(debouncedServiceSearch)))
    } else {
      set_filtered__service_dropdown(service_dropdown.filter(item => item.lookupName !== ''))
    }
  }, [debouncedServiceSearch, service_dropdown])

  return (
    <Drawer
      anchor='bottom'
      open={openServiceMappingDrawer}
      onClose={() => setOpenServiceMappingDrawer('')}
      PaperProps={{
        sx: {
          height: '93%'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{ zIndex: 2, position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
          onClick={() => setOpenServiceMappingDrawer(false)}
        >
          <ClearRoundedIcon sx={{ width: '30px', height: '30px', color: theme.palette.company.primary }} />{' '}
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.palette.company.tertiary,
            position: 'fixed',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: '60%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography variant='h4'>Service Mapping </Typography>
              {serviceMappingName.length > 0 && (
                <Box
                  sx={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: theme.palette.company.background,
                    background: theme.palette.company.secondary,
                    borderRadius: '50px'
                  }}
                >
                  {serviceMappingName.length}
                </Box>
              )}{' '}
            </Box>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <TextField
                sx={{
                  padding: '0px',
                  borderColor: theme.palette.company.grey,
                  input: {
                    padding: '7px',
                    fontSize: '14px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.company.secondary,
                    borderWidth: 1
                  }
                }}
                variant='outlined'
                value={serviceMappingSearch}
                onChange={e => setServiceMappingSearch(e.target.value)}
              />
              <Button variant='secondary' sx={{ width: '70px' }} onClick={() => setOpenServiceMappingDrawer(false)}>
                Done
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '60%' }}>
            {filtered_service_dropdown.length > 0 ? (
              filtered_service_dropdown.map((item, index) => {
                return (
                  <Box
                    key={item.id}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: theme.palette.company.lightgrey,
                      background: index % 2 === 0 ? '#FAF9FB' : theme.palette.company.tertiary,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px'
                    }}
                    onClick={() => handleServiceChange(item.lookupName)}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: serviceMappingName.includes(item.lookupName)
                          ? theme.palette.company.primary
                          : theme.palette.company.text
                      }}
                    >
                      {item.lookupName}
                    </Typography>
                    <Box
                      sx={{
                        width: '30px',
                        minWidth: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: serviceMappingName.includes(item.lookupName)
                          ? theme.palette.company.primary
                          : theme.palette.company.background,
                        border: '1px solid',
                        borderColor: theme.palette.company.lightgrey,
                        borderRadius: '5px'
                      }}
                    >
                      <CheckIcon
                        sx={{
                          width: '16px',
                          height: '16px',

                          color: serviceMappingName.includes(item.lookupName)
                            ? theme.palette.company.background
                            : theme.palette.company.grey
                        }}
                      />{' '}
                    </Box>
                  </Box>
                )
              })
            ) : (
              <Box
                sx={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <img
                  alt='no result found'
                  src={withEnvPath('/images/icons/WarningIcon.svg')}
                  style={{ width: '40px', height: '40px' }}
                />
                <Typography variant='body2' sx={{ color: theme.palette.company.grey }}>
                  No result found! Search other key word.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ServiceMappingDrawer
