import React, { useRef, useEffect, useState } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { Box, Typography, Popover } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const TableTextTooltip = ({ value, colWidth, onClick }) => {
  const theme = useTheme()
  const cellRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    if (cellRef.current) {
      setIsOverflowing(cellRef.current.scrollWidth > cellRef.current.clientWidth)
    }
  }, [value, colWidth])

  const handleIconClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'doc-name-popover' : undefined

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          cursor: 'pointer'
        }}
      >
        <Typography
          ref={cellRef}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            minWidth: 0
          }}
          onClick={onClick}
        >
          {value}
        </Typography>

        {isOverflowing && (
          <Box
            onClick={handleIconClick}
            sx={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {open ? (
              <InfoRoundedIcon
                sx={{
                  width: '16px',
                  height: '16px'
                }}
              />
            ) : (
              <InfoOutlinedIcon
                sx={{
                  width: '16px',
                  height: '16px'
                }}
              />
            )}
          </Box>
        )}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          sx: {
            p: '10px',
            width: 300,
            maxWidth: 400,
            height: 'fit-content',
            backgroundColor: theme.palette.company.background,
            border: '1px solid',
            borderRadius: '10px',
            boxShadow: '0px 0px 15px #301E4E1A'
          }
        }}
      >
        <Typography variant='body2'>{value}</Typography>
      </Popover>
    </>
  )
}

export default TableTextTooltip
