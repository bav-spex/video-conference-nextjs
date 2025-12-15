import { useState, useEffect, useMemo } from 'react'

import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CommonTable from 'components/CommonTable'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getRisksByFilter, getColors, getRisks } from 'services/Risks/RiskService'
import { encrypt } from 'utils/routingEncryption'

const Risks = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [excelLoading, setExcelLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [risks, setRisks] = useState([])
  const [rows, setRows] = useState([])
  const [colorRules, setColorRules] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [risksPageSize, setRisksPageSize] = useState(10)
  const [risksPage, setRisksPage] = useState(0)

  const [deleteRiskId, setDeleteRiskId] = useState()

  const [controls, setControls] = useState([])

  const colorNameMap = {
    Yellow: '#DE8E05',
    Green: '#41A168',
    Amber: '#FFC107',
    Red: '#F22D2C'
  }

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await getAllControls()
        setControls(response)
      } catch (error) {
        console.error('Error fetching controls:', error)
      }
    }

    fetchControls()
  }, [])

  const getControlNamesByIds = ids => {
    if (!Array.isArray(ids) || ids.length === 0) return ''

    return ids
      .map(id => {
        const control = controls.find(c => c.id === id)

        return control ? control['control-number'] : `Unknown (${id})`
      })
      .join(', ')
  }

  const getColorForScore = score => {
    const rule = colorRules.find(rule => score >= rule.beginValue && score <= rule.endValue)
    let color = rule?.colour?.trim() || 'transparent'

    color = colorNameMap[color]

    return color ?? 'transparent'
  }

  useEffect(() => {
    getColors(data => {
      setColorRules(data)
    })
    getRisks(setRisks, setLoading)
  }, [])

  useEffect(() => {
    if (risks.length > 0) {
      const total_risks = risks.length

      const updatedRows = risks.map((row, counter) => {
        const submissiondate = new Date(row.submissiondate).toISOString().split('T')[0]

        const controlNames = getControlNamesByIds(row.controlList)

        const updatedRow = {
          ...row,
          submissiondate,
          number: total_risks - counter,
          controlList: controlNames
        }

        return updatedRow
      })
      setRows(updatedRows)
    }
  }, [risks, controls])

  const columns = useMemo(() => {
    return [
      {
        flex: 0.06,
        field: 'riskIdentifier',
        headerName: t('Risk Identifier'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 1.6 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/home/riskManagement/risks/edit/${encrypt(params.row.id)}`)}
              >
                {content}
              </Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.15,
        field: 'subject',
        headerName: t('Risk Encounter'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 1.6 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      },
      {
        flex: 0.07,
        field: 'inherentscore',
        headerName: t('Inherent Score'),
        renderCell: ({ row }) => {
          const score = row.inherentscore || 0
          const bgColor = getColorForScore(score)

          if (bgColor === 'transparent') {
            return <Typography sx={{ textAlign: 'center', width: '100%', fontWeight: 500 }}>{score}</Typography>
          }

          return (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: bgColor,
                background: `${bgColor}30`,
                padding: '2px 5px',
                color: bgColor,
                textAlign: 'center',
                width: '100%',
                maxWidth: '80px',
                fontWeight: 500,
                margin: '0px auto'
              }}
            >
              {score}
            </Box>
          )
        }
      },
      {
        flex: 0.07,
        field: 'residualscore',
        headerName: t('Residual Score'),
        renderCell: ({ row }) => {
          const score = row.residualscore || 0
          const bgColor = getColorForScore(score)
          if (bgColor === 'transparent') {
            return <Typography sx={{ textAlign: 'center', width: '100%', fontWeight: 500 }}>{score}</Typography>
          }

          return (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: bgColor,
                background: `${bgColor}30`,
                padding: '2px 5px',
                color: bgColor,
                textAlign: 'center',
                width: '100%',
                maxWidth: '80px',
                fontWeight: 500,
                margin: '0px auto'
              }}
            >
              {score}
            </Box>
          )
        }
      },
      {
        flex: 0.05,
        field: 'status',
        headerName: t('Status'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 1.6 // Rough estimate

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      },
      { flex: 0.05, field: 'lastreviewdate', headerName: t('Last Review Date'), hide: true },
      { flex: 0.05, field: 'nextreviewdate', headerName: t('Next Review Date'), hide: true },
      {
        flex: 0.06,
        field: 'owner',
        headerName: t('Owner'),
        renderCell: params => {
          const content = params.value
          const isOverflowing = params.colDef.width <= content?.length * 7.2

          return (
            <Tooltip placement='bottom-start' title={isOverflowing ? content : ''}>
              <Typography sx={{ cursor: 'pointer' }}>{content}</Typography>
            </Tooltip>
          )
        }
      }
    ]
  }, [router, t, colorRules])

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
              data={rows}
              key={'id'}
              columns={columns}
              pagination
              page={risksPage}
              onPageChange={newPage => setRisksPage(newPage)}
              pageSize={risksPageSize}
              onPageSizeChange={newPageSize => {
                setRisksPageSize(newPageSize)
                setRisksPage(0)
              }}
              exportFileName='Risks'
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Risks
