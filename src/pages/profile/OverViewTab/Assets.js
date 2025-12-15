import { useState, useEffect, useMemo } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonTable from 'components/CommonTable'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getAdditionlStakeHoldersDropDown, getAssetTypeDropdown, getSiteLocationDropDown } from 'services/common'
import { getAllAssets } from 'services/Risks/assets/AssetService'
import { encrypt } from 'utils/routingEncryption'

const ratingMap = {
  4: 'Critical',
  3: 'High',
  2: 'Medium',
  1: 'Low'
}

const Assets = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState([])

  // audit Table Pagination
  const [assetsPageSize, setAssetsPageSize] = useState(10) // Default audits size
  const [assetsPage, setAssetsPage] = useState(0) // Default audits

  const [assetTypeDropdown, setAssetTypeDropdown] = useState([])
  const [ownerDropdown, setOwnerDropdown] = useState([])
  const [locationDropdown, setLocationDropdown] = useState([])

  useEffect(() => {
    getAllAssets(setAssets, () => {}, setLoading)
    getAssetTypeDropdown(setAssetTypeDropdown, () => {})
    getAdditionlStakeHoldersDropDown(setOwnerDropdown, () => {})
    getSiteLocationDropDown(setLocationDropdown, () => {})
  }, [])

  const columns = useMemo(() => {
    return [
      {
        flex: 0.15,
        width: 50,
        field: 'assetName',
        headerName: t('Name'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 1.6 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/home/riskManagement/assets/edit/${encrypt(params.row.id)}`)}
              >
                {content}
              </Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.12,
        minWidth: 25,
        field: 'assetType',
        headerName: 'Type',
        renderCell: params => {
          const typeId = params.row.assetType * 1
          const type = assetTypeDropdown.filter(item => item.lookupId === typeId)[0]?.lookupName

          const isOverflowing = params.colDef.width <= type?.length * 9 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? type : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{type}</Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.12,
        minWidth: 200,
        field: 'description',
        headerName: t('Description'),
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
      {
        flex: 0.08,
        minWidth: 100,
        field: 'owner',
        headerName: t('Owner'),
        renderCell: ({ row }) => {
          const ownerId = row.owner
          const ownerName = ownerDropdown.filter(item => item.id === ownerId)[0]?.fullName || ''

          return <Typography>{ownerName}</Typography>
        }
      },
      {
        field: 'location',
        headerName: t('Location'),
        flex: 0.12,
        minWidth: 50,
        renderCell: params => {
          const locationId = params.row.location
          const location = locationDropdown.filter(item => item.lookupId === locationId)[0]?.lookupName

          const isOverflowing = params.colDef.width <= (location?.length || 0) * 7

          return (
            <Tooltip title={isOverflowing ? location : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{location}</Typography>
            </Tooltip>
          )
        }
      },
      {
        field: 'assetValue',
        headerName: t('Values'),
        type: 'text',
        flex: 0.08,
        renderCell: params => {
          const content = ratingMap[params.value] || params.value // <-- map number to string
          const isOverflowing = params.colDef.width <= content?.length * 7 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      }
    ]
  }, [assetTypeDropdown, locationDropdown, ownerDropdown, t])

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
              data={assets}
              key={'id'}
              columns={columns}
              pagination
              page={assetsPage}
              onPageChange={newPage => setAssetsPage(newPage)}
              pageSize={assetsPageSize}
              onPageSizeChange={newPageSize => {
                setAssetsPageSize(newPageSize)
                setAssetsPage(0) // Reset to first controlsPage when controlsPage size changes
              }}
              exportFileName='Assets'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Assets
