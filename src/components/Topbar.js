import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useAppSelector } from 'hooks/hooks'
import { selectMenuName, selectSubMenName } from 'store/ui/uiSlice'
import { toTitleCase, truncateText } from 'utils/misc'

import NotificationPopover from './NotificationPopover'
import ProfilePopover from './ProfilePopover'

const Topbar = ({ hardMenuName = '', hardSubmenuName = '', children }) => {
  const theme = useTheme()
  const menuName = useAppSelector(selectMenuName)
  const subMenuName = useAppSelector(selectSubMenName)

  return (
    <>
      <Box
        sx={{
          height: '80px',
          width: '100%',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.palette.company.gradient
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            padding: { xs: '0px 16px', md: '0px 30px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.palette.company.gradient
          }}
        >
          <Box sx={{ width: '60%' }}>
            {!subMenuName && (
              <Typography
                variant='h3'
                style={{ marginTop: '0px', color: theme.palette.company.background, maxWidth: '80%' }}
              >
                {truncateText(hardSubmenuName || toTitleCase(menuName), 50)}
              </Typography>
            )}
            {subMenuName && (
              <>
                <Box
                  style={{
                    background: '#ffffff20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 6px 2px',
                    width: 'fit-content',
                    borderRadius: '3px',
                    opacity: '0.6'
                  }}
                >
                  <Typography
                    style={{
                      fontSize: '12px',
                      color: theme.palette.company.background,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 1, // 👈 number of lines allowed
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {hardMenuName || toTitleCase(menuName)}
                  </Typography>
                </Box>
                <Typography
                  variant='h3'
                  style={{
                    marginTop: '5px',
                    color: theme.palette.company.background,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 1, // 👈 number of lines allowed
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {hardSubmenuName || toTitleCase(subMenuName)}
                </Typography>
              </>
            )}
          </Box>
          <Box>{children}</Box>
        </Box>
        <Box
          sx={{
            height: '100%',
            minWidth: 'fit-content',
            padding: { xs: '20px 20px', md: '20px 30px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '15px',
            background: theme.palette.company.lightprimary
          }}
        >
          <NotificationPopover />
          {/* <LanguagePopover /> */}
          <ProfilePopover />
        </Box>
      </Box>
      <Box
        sx={{
          height: '50px',
          width: '100%',
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.palette.company.gradient
        }}
      >
        {' '}
        <Box
          sx={{
            height: '100%',
            width: '100%',
            padding: { xs: '0px 16px', md: '0px 30px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.palette.company.primary
          }}
        >
          {subMenuName ? (
            <Box
              style={{
                background: '#ffffff20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 6px 2px',
                width: 'fit-content',
                borderRadius: '3px',
                opacity: '0.6'
              }}
            >
              <Typography
                style={{
                  fontSize: '12px',
                  color: theme.palette.company.background,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1, // 👈 number of lines allowed
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {hardMenuName || toTitleCase(menuName)}
              </Typography>
            </Box>
          ) : (
            <Box></Box>
          )}
          <Box
            sx={{
              height: '100%',
              minWidth: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: { xs: '10px', md: '16px' }
            }}
          >
            <NotificationPopover />
            {/* <LanguagePopover /> */}
            <ProfilePopover />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: '88px',
          width: '100%',
          padding: '10px 0px',
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: theme.palette.company.gradient
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            padding: { xs: '0px 16px', md: '0px 30px' },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '5px',
            background: theme.palette.company.gradient
          }}
        >
          <Box sx={{ width: { base: '100%', xsm: '60%' } }}>
            {!subMenuName && (
              <Typography
                variant='h3'
                style={{ marginTop: '0px', color: theme.palette.company.background, maxWidth: '80%' }}
              >
                {truncateText(hardSubmenuName || toTitleCase(menuName), 50)}
              </Typography>
            )}
            {subMenuName && (
              <>
                <Typography
                  variant={'h3'}
                  sx={{
                    fontSize: { xs: '20px', md: '24px' },
                    color: theme.palette.company.background,
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {hardSubmenuName || toTitleCase(subMenuName)}
                </Typography>
              </>
            )}
          </Box>
          {children && <Box>{children}</Box>}
        </Box>
      </Box>
    </>
  )
}

export default Topbar
