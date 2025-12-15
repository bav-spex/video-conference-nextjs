import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getFindings = (auditId, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit/${auditId}/findings`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      successCallback([])
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getRisksByFindings = (findingId, successCallback) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit/finding/${findingId}/risks`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
    })
    .catch(err => {
      console.log(err)
      successCallback([])
    })
}

export const getAssetssmentFindingByAssessmentId = (assessmentId, successCallback) => {
  apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}assessment-finding/getAssessmentFinding/${assessmentId}`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res.data)
    })
    .catch(err => {
      console.log(err)
      successCallback([])
    })
}

export const getAllCorrectiveActions = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment-finding/corrective_action`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      successCallback([])
      if (setLoading) {
        setLoading(false)
      }
    })
}
