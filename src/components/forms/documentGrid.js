import { useEffect, useState } from 'react'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CommonTable from 'components/CommonTable'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getBase64StringFromFileId } from 'services/common'

import DocumentViewer from './documentViewer'

const DocumentGrid = ({ title, documentsArray, open, handleCancelModel }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [documentPageSize, setDocumentPageSize] = useState(10) // Default controls size
  const [documentsPage, setDocumentsPage] = useState(0) // Default controls
  const [openDocumentViewer, setDocumentViewer] = useState(false)
  const [gridDocumentArray, setGridDocumentArray] = useState([])
  const [file, setFile] = useState(null)
  const [type, setType] = useState('image')
  const [documentLoading, setDocumentLoading] = useState(false)
  const [documentDownloading, setDocumentDownloading] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)

  const documentColumn = [
    {
      flex: 0.8,
      field: 'filename',
      headerName: t('Evidence Name')
    },

    {
      flex: 0.2,
      field: 'fileId',
      headerName: t('Action'),
      renderCell: ({ row }) => {
        return (
          <>
            <>
              {!['xls', 'xlsx', 'csv', 'docx'].some(ext => row.filename?.toLowerCase().includes(ext)) && (
                <IconButton
                  onClick={() => handleOpenDocumentViewer(row)}
                  sx={{ cursor: 'pointer' }}
                  disabled={documentDownloading}
                >
                  {documentLoading && selectedDocumentId && selectedDocumentId === row.fileId ? (
                    <CircularProgress size='24px' sx={{ color: theme.palette.company.primary }} />
                  ) : (
                    <RemoveRedEyeOutlinedIcon
                      sx={{ color: theme.palette.company.primary }}
                      titleAccess='View Evidence'
                    />
                  )}
                </IconButton>
              )}
              <IconButton
                onClick={() => DownloadFileFromFileId(row)}
                sx={{ cursor: 'pointer' }}
                disabled={documentLoading}
              >
                {documentDownloading && selectedDocumentId && selectedDocumentId === row.fileId ? (
                  <CircularProgress size='24px' sx={{ color: theme.palette.company.primary }} />
                ) : (
                  <FileDownloadOutlinedIcon
                    sx={{ color: theme.palette.company.primary }}
                    titleAccess='Download Evidence'
                  />
                )}
              </IconButton>
            </>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    if (open && documentsArray.length > 0) {
      setGridDocumentArray(documentsArray.filter(document => document.fileId !== null))
    }
  }, [open])

  useEffect(() => {
    if (file) {
      setDocumentViewer(true)
    }
  }, [file])

  const DownloadFileFromFileId = row => {
    setDocumentDownloading(true)
    setSelectedDocumentId(row.fileId)
    getBase64StringFromFileId(row.fileId)
      .then(response => {
        const fileNameArray = row.filename.split('.')
        const ext = fileNameArray[fileNameArray.length - 1].toLowerCase()
        setType(ext === 'pdf' ? 'pdf' : 'image')

        let downloadLink = document.createElement('a')
        document.body.appendChild(downloadLink)

        if (ext === 'xlsx') {
          const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const byteCharacters = atob(response.data)
          const byteArrays = []

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }

            byteArrays.push(new Uint8Array(byteNumbers))
          }

          const blob = new Blob(byteArrays, { type: mimeType })
          const url = URL.createObjectURL(blob)
          downloadLink.href = url
          downloadLink.download = row.filename
          downloadLink.click()
          URL.revokeObjectURL(url)
        } else {
          let mimeType = ''

          switch (ext) {
            case 'pdf':
              mimeType = 'application/pdf'
              break
            case 'txt':
              mimeType = 'text/plain'
              break
            case 'xls':
              mimeType = 'application/vnd.ms-excel'
              break
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
              mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`
              break
            default:
              mimeType = 'application/octet-stream'
          }

          const base64String = `data:${mimeType};base64,${response.data}`
          downloadLink.href = base64String
          downloadLink.download = row.filename
          downloadLink.click()
        }
        setDocumentDownloading(false)
        setSelectedDocumentId(null)
      })
      .catch(err => {
        setDocumentDownloading(false)
        setSelectedDocumentId(null)
        toast.error('Error downloading file')
      })
  }

  const handleOpenDocumentViewer = row => {
    setSelectedDocumentId(row.fileId)
    setDocumentLoading(true)
    getBase64StringFromFileId(row.fileId)
      .then(response => {
        const fileNameArray = row.filename.split('.')
        const ext = fileNameArray[fileNameArray.length - 1].toLowerCase()
        setType(ext)

        if (ext === 'xlsx') {
          // Handle XLSX with Blob
          const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const byteCharacters = atob(response.data)
          const byteArrays = []

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)

            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }

            byteArrays.push(new Uint8Array(byteNumbers))
          }

          const blob = new Blob(byteArrays, { type: mimeType })
          setFile(blob)
        } else {
          // Handle other types using base64 string
          let mimeType = ''

          switch (ext) {
            case 'pdf':
              mimeType = 'application/pdf'
              break
            case 'txt':
              mimeType = 'text/plain'
              break
            case 'xls':
              mimeType = 'application/vnd.ms-excel'
              break
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
              mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`
              break
            default:
              mimeType = 'application/octet-stream'
          }

          const base64String = `data:${mimeType};base64,${response.data}`
          setFile(base64String)
        }

        setDocumentLoading(false)
      })
      .catch(err => {
        toast.error('Error Previewing file')

        setDocumentLoading(false)
      })
  }

  const handleCancelDocumentViewer = () => {
    setDocumentViewer(false)
    setFile(null)
    setType('')
    setSelectedDocumentId(null)
  }

  return (
    <>
      {openDocumentViewer && (
        <DocumentViewer
          file={file}
          type={type}
          open={openDocumentViewer}
          createObjectURL={false}
          handleCancelModel={handleCancelDocumentViewer}
        ></DocumentViewer>
      )}

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
        }}
        open={open}
      >
        <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
          <Typography variant='h4'>{title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px' } }}>
          <Box style={{ height: 350, border: '1px solid #d4d4d4', borderRadius: '5px', overflow: 'hidden' }}>
            <CommonTable
              toolbar={false}
              data={gridDocumentArray}
              key={'fileId'}
              columns={documentColumn}
              getRowId={row => (row.fileId ? row.fileId : 0)}
              page={documentsPage}
              onPageChange={newPage => setDocumentsPage(newPage)}
              pageSize={documentPageSize}
              onPageSizeChange={newPageSize => {
                setDocumentPageSize(newPageSize)
                setDocumentsPage(0) // Reset to first documentsPage when documentsPage size changes
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: '10px', sm: '20px' }, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='outlined'
            onClick={handleCancelModel}
            sx={{ padding: '10px 30px', width: '100px', height: '46px', margin: '0px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DocumentGrid
