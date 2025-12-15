import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { borderRadius: 3, p: 1, boxShadow: 6 } // custom styling
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='error' variant='outlined'>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color='primary' variant='contained'>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
