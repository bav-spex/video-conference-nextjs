import { useTheme } from '@mui/material/styles'
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid'

function CustomToolbar({ fileName = 'data_export', toolbarExport = true }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {toolbarExport && (
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }} // ✅ hides print option
          csvOptions={{
            allColumns: true, // ✅ include hidden columns in export
            utf8WithBom: true, // ✅ better encoding for Excel
            fileName
          }}
        />
      )}
    </GridToolbarContainer>
  )
}

const CommonTable = ({
  data = [],
  key = 'id',
  columns = [],
  pageSize,
  onPageSizeChange,
  page,
  onPageChange,
  sizeRange = [],
  toolbar = true,
  toolbarExport = true,
  exportFileName = 'data_export',
  sx,
  ...props
}) => {
  const theme = useTheme()

  return (
    <DataGrid
      rows={data}
      getRowId={row => row[key]}
      columns={columns}
      pagination={data.length > 10}
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      rowsPerPageOptions={[...sizeRange, 10, 15, 25, 50, 100]}
      autoHeight
      components={{
        Toolbar: toolbar ? CustomToolbar : '' // ✅ adds search + filter + density options
      }}
      componentsProps={{
        toolbar: {
          fileName: exportFileName, // ✅ passes filename properly to CustomToolbar
          toolbarExport: toolbarExport
        },
        columnMenu: {
          sx: {
            '& .MuiMenuItem-root': {
              color: theme.palette.company.text,
              background: theme.palette.company.background,
              borderRadius: '5px',
              '&:hover': {
                color: theme.palette.company.primary,
                background: theme.palette.company.tertiary
              },
              '&.Mui-disabled': {
                color: theme.palette.company.primary,
                background: theme.palette.company.tertiary,
                border: '1px solid',
                borderColor: theme.palette.company.primary
              }
            }
          }
        }
      }}
      sx={{
        minWidth: 900,
        border: 'none',
        borderRadius: '0px !important',
        '& .MuiDataGrid-cell:first-of-type': {
          pl: { xs: '16px', md: '30px' } // padding-left
        },
        // last column cells
        '& .MuiDataGrid-cell:last-of-type': {
          pr: { xs: '16px', md: '30px' } // padding-right
        },
        // also apply to headers
        '& .MuiDataGrid-columnHeader:first-of-type': {
          pl: { xs: '16px', md: '30px' }
        },
        '& .MuiDataGrid-columnHeader:last-of-type': {
          pr: { xs: '16px', md: '30px' }
        },
        // Header
        '& .MuiDataGrid-columnHeaders': {
          borderRadius: '0px !important',
          height: 50,
          backgroundColor: theme.palette.company.tableHeaderBackground,
          color: theme.palette.company.text,
          outline: 'none',
          lineHeight: '50px'
        },
        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnSeparator': {
          height: 50
        },
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none'
        },

        // Header Title
        '& .MuiDataGrid-columnHeaderTitle': {
          whiteSpace: 'normal',
          lineHeight: '1.4',
          fontWeight: 600,
          fontSize: 14
        },

        // Rows
        '& .MuiDataGrid-row': {
          height: 50,
          cursor: 'pointer',
          '&:nth-of-type(odd)': {
            backgroundColor: '#FAF9FB'
          },
          '&:hover': {
            backgroundColor: theme.palette.company.tertiary
          }
        },

        // Cells
        '& .MuiDataGrid-cell': {
          fontSize: 16,
          height: 50,
          outline: 'none',
          whiteSpace: 'normal !important',
          lineHeight: '1.4rem',
          wordBreak: 'break-word'
        },
        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none'
        },

        // Selected row
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: theme.palette.company.tertiary,
          outline: 'none'
        },

        // Pagination
        '& .MuiDataGrid-footerContainer': {
          borderRadius: '0px !important',
          backgroundColor: theme.palette.company.tertiary,
          padding: '8px 30px'
        },
        ...sx
      }}
      {...props}
    />
  )
}

export default CommonTable
