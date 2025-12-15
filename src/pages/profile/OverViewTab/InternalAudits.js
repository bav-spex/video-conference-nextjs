import { useState, useEffect, useMemo } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonTable from 'components/CommonTable'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getInternalAudits } from 'services/compliance/audits/AuditsServices'
import { encrypt } from 'utils/routingEncryption'

const InternalAudits = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [audits, setAudits] = useState([])
  const [auditsPageSize, setAuditsPageSize] = useState(10) // Default audits size
  const [auditsPage, setAuditsPage] = useState(0) // Default audits

  useEffect(() => {
    getInternalAudits(setAudits, setLoading)
  }, [])

  const columns = useMemo(() => {
    return [
      {
        flex: 0.15,
        width: 50,
        field: 'auditName',
        headerName: t('Assessment'),
        valueGetter: () => 'Assessment', // ✅ This ensures CSV includes the value
        renderCell: params => {
          const content = 'Assessment'
          const isOverflowing = params.colDef.width <= content?.length * 1.6

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  router.push(
                    `/home/compliance/internalAudits/${encrypt(params.row.frameworkId)}/requirement/${encrypt(
                      params.row.requirementId
                    )}/controlTests/assessment/${encrypt(params.row.assessmentId)}`
                  )
                }
              >
                {content}
              </Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.08,
        minWidth: 10,
        field: 'assessmentDate',
        headerName: t('Assessment Date'),
        valueGetter: params => moment(params.value).format('DD-MM-YYYY'), // ✅ this will also be used for export
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 5.7

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
              rows={audits}
              key={'assessmentId'}
              getRowId={row => row.assessmentId}
              columns={columns}
              pagination
              page={auditsPage}
              onPageChange={newPage => setAuditsPage(newPage)}
              pageSize={auditsPageSize}
              onPageSizeChange={newPageSize => {
                setAuditsPageSize(newPageSize)
                setAuditsPage(0) // Reset to first policiesPage when policiesPage size changes
              }}
              exportFileName='Internal_Audit'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default InternalAudits
