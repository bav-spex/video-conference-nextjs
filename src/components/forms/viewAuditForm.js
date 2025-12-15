import React, { useEffect, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { Box, Typography, Grid, Button, CardContent, FormControl, TextField, Divider, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import FallbackSpinner from 'components/spinner'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getQuestionAnswers } from 'services/compliance/internalAssesment/ControlService'

const ViewAuditForm = ({ formType, assesmentId }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [answerData, setAnswerData] = useState([])
  const [updatedAnswers, setUpdatedAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  const statusMap = {
    206: 'Pending',
    208: 'Completed'
  }

  useEffect(() => {
    const fetchQuestion = () => {
      let successCallback = response => {
        setAnswerData(response)
        setLoading(false)
      }

      let errorCallback = response => {
        console.error('Something went wrong', response)
        setLoading(false)
      }

      getQuestionAnswers(assesmentId, successCallback, errorCallback)
    }

    fetchQuestion()
  }, [assesmentId])

  const handleViewControl = () => {
    const frameworkId = 8
    const testId = 123
    router.push(`/home/compliance/internalAudits/${frameworkId}/automation/test/${testId}/assessment/edit/control`)
  }

  const columns = [
    { field: 'question', headerName: 'Question', flex: 1, editable: false },
    {
      field: 'answer',
      headerName: 'Answer',
      flex: 1,
      editable: true,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2'>{params.value}</Typography>
          <EditIcon fontSize='small' color='action' />
        </Box>
      ),
      onCellEditStart: (params, event) => {
        event.stopPropagation()
      },
      onCellEditCommit: params => {
        const updatedData = { ...updatedAnswers, [params.id]: { ...updatedAnswers[params.id], answer: params.value } }
        setUpdatedAnswers(updatedData)
      }
    },
    {
      field: 'referenceDocs',
      headerName: 'Reference Docs',
      flex: 1,
      renderCell: params => {
        const questionId = params.row.id

        const handleFileChange = e => {
          const files = Array.from(e.target.files)
          setUpdatedAnswers(prev => {
            const currentFiles = prev[questionId]?.files || []
            const newFiles = [...currentFiles, ...files]

            return {
              ...prev,
              [questionId]: {
                ...prev[questionId],
                files: newFiles
              }
            }
          })
        }

        const uploadedFiles = updatedAnswers[questionId]?.files || []

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* File Input First */}
            <Box>
              <input type='file' accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg' onChange={handleFileChange} multiple />
            </Box>

            {/* Uploaded File List Below */}
            <Box sx={{ marginTop: 1 }}>
              {uploadedFiles.map((file, index) => (
                <Typography key={index} variant='body2' sx={{ wordWrap: 'break-word', fontSize: '0.8rem' }}>
                  {file.name}
                </Typography>
              ))}
            </Box>
          </Box>
        )
      }
    }
  ]

  const rows =
    answerData?.controlAssessment?.question?.map(q => ({
      id: q.questionId,
      question: q.question,
      answer: q.answer?.answer || 'N/A',
      referenceDocs: q.files || []
    })) || []

  if (loading) return <FallbackSpinner />

  return (
    <>
      <CardContent sx={{ padding: '0px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{formType || 'View Audit'}</h3>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              marginLeft: 'auto',
              display: 'flex',
              justifyContent: 'right',
              marginBottom: 2,
              '@media screen and (max-width:600px)': {
                flexDirection: 'row',
                marginLeft: 0
              }
            }}
          >
            <Button
              variant='contained'
              size='medium'
              onClick={() =>
                router.push({
                  pathname: `/home/compliance/internalAudits/${router.query.frameworkId}/automation/test`,
                  query: {
                    requirementId: router.query.requirementId
                  }
                })
              }
            >
              {t('Cancel')}
            </Button>
            <Button type='submit' size='medium' variant='contained' style={{ marginLeft: '10px' }}>
              Save
            </Button>
          </Grid>
        </Box>

        <Grid container spacing={2} marginTop={'10px'}>
          <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                type='date'
                label='Assessment Date'
                InputLabelProps={{ shrink: true }}
                value={
                  answerData?.controlAssessment?.assessmentDate
                    ? moment(answerData.controlAssessment.assessmentDate).format('YYYY-MM-DD')
                    : ''
                }
              />
            </FormControl>
          </Grid>

          <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth>
              <TextField
                select
                label='Auditor'
                value={answerData?.controlAssessment?.auditor || ''}
                onChange={e => {
                  const selectedAuditor = e.target.value
                  setAnswerData(prev => ({
                    ...prev,
                    controlAssessment: {
                      ...prev.controlAssessment,
                      auditor: selectedAuditor
                    }
                  }))
                }}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={answerData?.controlAssessment?.auditor}>
                  {answerData?.controlAssessment?.auditor}
                </MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item sx={{ width: '40%', marginBottom: '3vh' }}>
            <FormControl fullWidth>
              <TextField
                select
                label='Status'
                value={answerData?.controlAssessment?.status || ''}
                onChange={e => {
                  const newStatus = e.target.value
                  setAnswerData(prev => ({
                    ...prev,
                    controlAssessment: {
                      ...prev.controlAssessment,
                      status: newStatus
                    }
                  }))
                }}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={answerData?.controlAssessment?.status}>
                  {statusMap[answerData?.controlAssessment?.status || '']}
                </MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item sx={{ width: '40%', marginBottom: '3vh' }} style={{ marginLeft: 'auto' }}>
            <FormControl fullWidth>
              <TextField
                type='date'
                label='Last Assessment Date'
                InputLabelProps={{ shrink: true }}
                value={
                  answerData?.controlAssessment?.lastAssessmentDate
                    ? moment(answerData.controlAssessment.lastAssessmentDate).format('YYYY-MM-DD')
                    : ''
                }
                disabled
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' size='medium' onClick={handleViewControl}>
          {t('View Control Details')}
        </Button>
      </Box>

      <Divider />

      <Box display='flex' justifyContent='space-between' alignItems='center' my={2} width='100%'>
        <Box sx={{ width: '100%', height: '400px' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowHeight={() => 'auto'}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              '& .MuiDataGrid-cell': {
                backgroundColor: '#F9FAFC',
                padding: '8px 12px',
                fontSize: '0.875rem',
                fontWeight: 500
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#F9FAFC',
                fontWeight: 'bold',
                color: '#333',
                border: '0.5px solid #e0e0e0'
              }
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default ViewAuditForm
