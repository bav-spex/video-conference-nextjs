import { useState, useEffect, useMemo } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonTable from 'components/CommonTable'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getAudits } from 'services/compliance/audits/AuditsServices'
import { encrypt } from 'utils/routingEncryption'

const ExternalAudits = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [audits, setAudits] = useState([])
  const [auditsPageSize, setAuditsPageSize] = useState(10) // Default audits size
  const [auditsPage, setAuditsPage] = useState(0) // Default audits

  useEffect(() => {
    getAudits(setAudits, setLoading)
  }, [])

  const columns = useMemo(() => {
    return [
      {
        flex: 0.04,
        width: 50,
        field: 'id',
        headerName: t('ID'),
        hide: true,
        hideable: false
      },
      {
        flex: 0.15,
        width: 50,
        field: 'auditName',
        headerName: t('Name'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 1.6 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/home/compliance/externalAudits/edit/${encrypt(params.row.id)}`)}
              >
                {content}
              </Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.06,
        minWidth: 25,
        field: 'categoryName',
        headerName: 'Category',
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 9 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.08,
        minWidth: 10,
        field: 'statusName',
        headerName: t('Status'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 5.7 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      },
      { flex: 0.08, minWidth: 10, field: 'ownerName', headerName: t('owner') },
      {
        field: 'auditDate',
        headerName: t('Audit Date'),
        type: 'date',
        flex: 0.08,
        minWidth: 25,
        sortComparator: (v1, v2, cellParams1, cellParams2) => {
          const timestamp1 = new Date(v1).getTime()
          const timestamp2 = new Date(v2).getTime()
          if (timestamp1 < timestamp2) {
            return -1
          }
          if (timestamp1 > timestamp2) {
            return 1
          }

          return 0
        }
      },
      {
        field: 'frameworkName',
        headerName: t('Framework Name'),
        type: 'text',
        flex: 0.08,
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 7 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      }
    ]
  }, [])

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
              data={audits}
              key={'id'}
              columns={columns}
              pagination
              page={auditsPage}
              onPageChange={newPage => setAuditsPage(newPage)}
              pageSize={auditsPageSize}
              onPageSizeChange={newPageSize => {
                setAuditsPageSize(newPageSize)
                setAuditsPage(0) // Reset to first controlsPage when controlsPage size changes
              }}
              exportFileName='External_Audit'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ExternalAudits
