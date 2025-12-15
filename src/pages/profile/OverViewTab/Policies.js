import { useState, useEffect } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonTable from 'components/CommonTable'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getAllPolicies } from 'services/governance/documents/DocumentsServices'
import { convertDateFormat } from 'utils/common'
import { encrypt } from 'utils/routingEncryption'

const Policies = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState([])
  // Policies Table Pagination
  const [policiesPageSize, setPoliciesPageSize] = useState(10) // Default policiesPage size
  const [policiesPage, setPoliciesPage] = useState(0) // Default policiesPage

  useEffect(() => {
    getAllPolicies(setDocuments, () => {}, setLoading)
  }, [])

  const columns = [
    {
      flex: 0.5,
      field: 'doc_name',
      headerName: t('Policy Name'),
      renderCell: params => {
        const content = params.value
        const isOverflowing = params.colDef.width <= content?.length * 1.5 // Rough estimate

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
              onClick={() => router.push(`/home/governance/documents/edit/${encrypt(params.row.doc_id)}`)}
            >
              {content}
            </Typography>
          </Tooltip>
        )
      }
    },
    { flex: 0.15, field: 'documentTypeName', headerName: t('Document Type') },
    {
      flex: 0.15,
      field: 'creation_date',
      headerName: t('Creation Date'),
      renderCell: ({ row }) => {
        let value = convertDateFormat(row.creation_date) || '-'

        return value
      }
    },
    {
      flex: 0.15,
      field: 'approval_date',
      headerName: t('Approval Date'),
      renderCell: ({ row }) => {
        let value = convertDateFormat(row.approval_date) || '-'

        return value
      }
    },
    { flex: 0.15, field: 'documentStatusName', headerName: t('Status') }
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
              rows={documents.map(doc => ({
                ...doc,
                creation_date: convertDateFormat(doc.creation_date) || '-',
                approval_date: convertDateFormat(doc.approval_date) || '-'
              }))}
              key={'doc_id'}
              getRowId={row => row.doc_id}
              columns={columns}
              pagination
              page={policiesPage}
              onPageChange={newPage => setPoliciesPage(newPage)}
              pageSize={policiesPageSize}
              onPageSizeChange={newPageSize => {
                setPoliciesPageSize(newPageSize)
                setPoliciesPage(0) // Reset to first policiesPage when policiesPage size changes
              }}
              exportFileName='Policies'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Policies
