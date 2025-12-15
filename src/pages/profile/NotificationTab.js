import React, { useEffect, useMemo, useState } from 'react'

import { CircularProgress, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CommonTable from 'components/CommonTable'
import authConfig from 'configs/auth'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { getAllNotifications } from 'services/common'
import apiHelper from 'store/apiHelper'
import { encrypt } from 'utils/routingEncryption'

const NotificationTab = () => {
  const theme = useTheme()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [notificationData, setNotificationData] = useState([])
  const [notificationPageSize, setNotificationPageSize] = useState(10)
  const [notificationPage, setNotificationPage] = useState(0)

  useEffect(() => {
    getAllNotifications(
      data => {
        const sortedData = [...data].sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
        setNotificationData(sortedData)
        setLoading(false)
      },
      () => {
        setLoading(false)
      }
    )
  }, [])

  const markNotificationAsRead = async (id, onSuccess, onError) => {
    try {
      const response = await apiHelper(
        `${authConfig.authDevRakshitah_base_url}notification/updateStatus/${id}`,
        'PUT',
        {}
      )
      if (onSuccess) onSuccess(response.data)
    } catch (error) {
      console.error('Error marking as read:', error)
      if (onError) onError(error)
    }
  }

  const handleNotificationClick = row => {
    const { id, status, type, entityId } = row

    if (status?.toLowerCase() === 'unread') {
      markNotificationAsRead(
        id,
        () => {
          setNotificationData(prev => prev.map(r => (r.id === id ? { ...r, status: 'Read' } : r)))
        },
        error => console.error(error)
      )
    }

    const lowerType = type?.toLowerCase()

    if (lowerType.includes('risk')) router.push(`/home/riskManagement/risks/edit/${encrypt(entityId)}`)
    else if (lowerType.includes('frameworks')) router.push('/home/governance/frameworks')
    else if (lowerType.includes('control')) router.push(`/home/governance/controls/edit/${encrypt(entityId)}`)
    else if (lowerType.includes('policy')) router.push(`/home/governance/documents/edit/${encrypt(entityId)}`)
    else if (lowerType.includes('asset')) router.push(`/home/riskManagement/assets/edit/${encrypt(entityId)}`)
    else if (lowerType.includes('internal audit')) router.push('/home/compliance/internalAudits')
    else if (lowerType.includes('audit')) router.push(`/home/compliance/externalAudits/edit/${entityId}`)
    else console.log('Invalid notification type')
  }

  const columns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Content',
        flex: 0.9,
        filterable: true,
        renderCell: params => (
          <Typography sx={{ cursor: 'pointer' }} onClick={() => handleNotificationClick(params.row)}>
            {params.row.title}
          </Typography>
        )
      },
      {
        field: 'type',
        headerName: 'Category',
        flex: 0.3,
        filterable: true,
        renderCell: params => <Typography>{params.row.type}</Typography>
      },

      {
        field: 'createAt',
        headerName: 'Received Time',
        flex: 0.4,
        type: 'dateTime',
        filterable: true,
        valueGetter: params => new Date(params.row.createAt),
        renderCell: params => {
          const rawDate = params.row.createAt
          const formattedDate = rawDate ? format(new Date(rawDate), 'yyyy-MM-dd , p') : 'N/A'

          return <Typography>{formattedDate}</Typography>
        }
      }
    ],
    [router]
  )

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
        <Box className='scrollDiv' sx={{ overflow: 'auto' }}>
          <Box style={{ width: '100%' }}>
            <CommonTable
              data={notificationData}
              key={'id'}
              getRowId={row => row.id}
              columns={columns}
              pagination
              page={notificationPage}
              onPageChange={newPage => setNotificationPage(newPage)}
              pageSize={notificationPageSize}
              onPageSizeChange={newPageSize => {
                setNotificationPageSize(newPageSize)
                setNotificationPage(0)
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              exportFileName='Notifications'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default NotificationTab
