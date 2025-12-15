import React, { useEffect, useMemo, useState } from 'react'

import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { CircularProgress, Drawer, Grid, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CommonTable from 'components/CommonTable'
import useDebounce from 'hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import { withEnvPath } from 'utils/misc'

const CommonLinkDrawer = ({
  drawerTitle,
  open,
  setOpen,
  handleCancel,
  columns,
  keyForName,
  keyForId,
  item_dropdown,
  selectedItems,
  handleCheckBoxChange,
  savingForm,
  handleSubmit,
  exportFileName
}) => {
  const theme = useTheme()
  const [itemSearch, setControlSearch] = useState('')
  const [filtered_item_dropdown, set_filtered__item_dropdown] = useState([])
  const debouncedSearch = useDebounce(itemSearch, 500)
  const { t } = useTranslation()
  // items Table Pagination
  const [itemsPageSize, setControlsPageSize] = useState(10) // Default items size
  const [itemsPage, setControlsPage] = useState(0) // Default items

  useEffect(() => {
    if (item_dropdown) {
      set_filtered__item_dropdown(
        item_dropdown.filter(item => item[keyForName].toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
    } else {
      set_filtered__item_dropdown(item_dropdown.filter(item => item[keyForName] !== ''))
    }
  }, [debouncedSearch, item_dropdown])

  return (
    <Drawer
      anchor='bottom'
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return
      }}
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
          height: '100%',
          position: 'relative'
        }}
      >
        {savingForm && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent overlay
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.company.background,
                p: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.company.primary }} />
            </Box>
          </Box>
        )}
        <Box
          sx={{ zIndex: 2, position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
          onClick={() => {
            setControlSearch('')
            handleCancel()
          }}
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
              width: { xs: '100%', md: '60%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: { xs: '10px 16px', md: '10px 0px' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography variant='h4'>{drawerTitle}</Typography>
              {selectedItems.length > 0 && (
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
                  {selectedItems.length}
                </Box>
              )}{' '}
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '10px' }}>
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
                value={itemSearch}
                onChange={e => setControlSearch(e.target.value)}
              />
              <Button variant='secondary' sx={{ width: '70px' }} onClick={() => handleSubmit()}>
                {savingForm ? (
                  <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
                ) : (
                  t('Done')
                )}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            paddingTop: '55px'
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '60%' },
              display: { xs: 'flex', sm: 'none' },
              alignItems: 'center',
              justifyContent: 'end',
              padding: { xs: '10px 16px', md: '10px 0px' }
            }}
          >
            {' '}
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
                value={itemSearch}
                onChange={e => setControlSearch(e.target.value)}
              />
              <Button variant='secondary' sx={{ width: '70px' }} onClick={() => handleSubmit()}>
                {savingForm ? (
                  <CircularProgress size='20px' sx={{ color: theme.palette.company.background }} />
                ) : (
                  t('Done')
                )}
              </Button>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '60%' }, overflowX: 'scroll' }} className={'scrollDiv'}>
            {filtered_item_dropdown.length > 0 ? (
              <>
                {' '}
                <Box style={{ width: '100%' }}>
                  <CommonTable
                    data={filtered_item_dropdown}
                    key={keyForId}
                    columns={columns}
                    getRowId={row => row[keyForId]}
                    onRowClick={params => handleCheckBoxChange(params.row[keyForId])}
                    pagination
                    page={itemsPage}
                    onPageChange={newPage => setControlsPage(newPage)}
                    pageSize={itemsPageSize}
                    onPageSizeChange={newPageSize => {
                      setControlsPageSize(newPageSize)
                      setControlsPage(0) // Reset to first itemsPage when itemsPage size changes
                    }}
                    exportFileName={exportFileName}
                  />
                </Box>
              </>
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

export default CommonLinkDrawer
