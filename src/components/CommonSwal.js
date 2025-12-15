import Swal from 'sweetalert2'

export function CommonSwal(theme, options) {
  return Swal.fire({
    background: theme.palette.company.background,
    color: theme.palette.company.text,
    confirmButtonColor: theme.palette.company.primary,
    cancelButtonColor: theme.palette.company.grey,
    customClass: {
      confirmButton: 'my-swal-confirm',
      cancelButton: 'my-swal-cancel'
    },
    ...options // merge with your custom options
  })
}
