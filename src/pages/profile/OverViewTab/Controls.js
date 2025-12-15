import { useState, useEffect } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import CommonTable from 'components/CommonTable'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getAllControls } from 'services/governance/controls/ControlsServices'
import { encrypt } from 'utils/routingEncryption'

const Controls = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [controls, setControls] = useState([])

  // controls Table Pagination
  const [controlsPageSize, setControlsPageSize] = useState(15) // Default controls size
  const [controlsPage, setControlsPage] = useState(0) // Default controls

  useEffect(() => {
    getAllControls(setControls, () => {}, setLoading)
  }, [])

  const columns = [
    {
      flex: 0.5,
      field: 'name',
      headerName: t('Name'),
      renderCell: params => {
        const content = params.value
        const isOverflowing = params.colDef.width <= content?.length * 1.2 // Rough estimate

        return (
          <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
            <Typography
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.company.primary,
                  fontWeight: 500
                }
              }}
              onClick={() => router.push(`/home/governance/controls/${encrypt(params.row.id)}`)}
            >
              {content}
            </Typography>
          </Tooltip>
        )
      }
    },
    { flex: 0.15, field: 'frameworks', headerName: t('Framework Name') },

    { flex: 0.15, field: 'status', headerName: t('Status') }
  ]

  return (
    <Box style={{ overflowY: 'hidden' }}>
      {loading ? (
        <Box
          sx={{
            height: '20vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <CircularProgress disableShrink sx={{ mt: 6, color: theme.palette.company.primary }} />
        </Box>
      ) : (
        <Box className={'scrollDiv'} sx={{ overflow: 'auto' }}>
          <Box style={{ width: '100%' }}>
            <CommonTable
              data={controls}
              key={'id'}
              columns={columns}
              pagination
              page={controlsPage}
              onPageChange={newPage => setControlsPage(newPage)}
              pageSize={controlsPageSize}
              onPageSizeChange={newPageSize => {
                setControlsPageSize(newPageSize)
                setControlsPage(0) // Reset to first controlsPage when controlsPage size changes
              }}
              exportFileName='Controls'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Controls
