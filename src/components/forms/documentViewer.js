import { useEffect, useState } from 'react'

import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const DocumentViewer = ({ file, type = '', createObjectURL = true, open, handleCancelModel }) => {
  const theme = useTheme()
  const [documentSrc, setDocumentSrc] = useState(file)

  useEffect(() => {
    if (open && file && createObjectURL) {
      const objectUrl = URL.createObjectURL(file)
      setDocumentSrc(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [open])

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return // 👈 ignore backdrop clicks
        }}
      >
        <DialogTitle sx={{ p: { xs: '20px', sm: '20px' } }}>
          <Typography variant='h4'>Document Viewer</Typography>
          <IconButton
            aria-label='close'
            onClick={handleCancelModel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <ClearRoundedIcon sx={{ width: '30px', height: '30px', color: theme.palette.company.primary }} />{' '}
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: '10px 10px', sm: '10px 20px 14px' } }}>
          <div style={{ height: 'auto' }}>
            {type?.includes('image') ? (
              <>
                <div style={{ width: '100%', height: '100%' }}>
                  {documentSrc && (
                    <img
                      src={decodeURIComponent(documentSrc)}
                      alt='Document Image'
                      style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <object data={documentSrc} type='application/pdf' width='100%' height='500px'>
                  <p>
                    Your browser does not support PDFs.{' '}
                    <a href={documentSrc} target='_blank' rel='noopener noreferrer'>
                      View / Download PDF
                    </a>
                    .
                  </p>
                </object>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocumentViewer
