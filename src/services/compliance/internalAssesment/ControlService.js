import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getAllControlTests = (id, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}test/getControlsTestByRequirementId/${id}`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getAllControlAssessment = (id, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/getAssessmentByTestId/${id}`, 'get')
    .then(res => {
      successCallback(res.data)
      if (setLoading) setLoading(false)
    })
    .catch(err => {
      if (setLoading) setLoading(false)
    })
}

export const getQuestionAnswers = (id, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/getControlTestAssessment/${id}`, 'get', null, {})
    .then(res => {
      successCallback(res.data.controlAssessment)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getCommetsByAssessmentId = (assessmentId, successCallback, setLoading) => {
  apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}assessment/${assessmentId}/testresult/comments`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getRiskInfoById = (id, action, errorCallback, successCallback) => {
  apiHelper(`${authConfig.get_assessment_by_id + id + '/testresult/' + action}`, 'get')
    .then(res => {
      successCallback(res.data)
      //if (setLoading) setLoading(false)
    })
    .catch(err => {
      if (errorCallback) errorCallback(err)
      //if (setLoading) setLoading(false)
    })
}

export const getRisksByAssessmentId = (assessmentId, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/${assessmentId}/testresult/risks`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const deleteQuestion = (questionId, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/deleteQuestion/${questionId}`, 'delete', null, {})
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}
