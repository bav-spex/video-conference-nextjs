import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getVendorAssessmentData = (vendorId, assessmentId) => {
  return apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/${vendorId}/questionaries/${assessmentId}`,
    'get',
    null,
    {}
  )
}

export const getVendorAssessmentByVendorId = (vendorId, successCallback, setLoading) => {
  apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/getAssessmentForVendor/${vendorId}`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getVendorAssessmentByUserId = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendorAssessment/getAssessmentForUser`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getVendorAssessmentCommentsByAnswerId = (answerId, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendorAssessment/ansReview/${answerId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const getHistoryForAssessment = (assessmentId, successCallback, setLoading) => {
  apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}assessment-finding/getLoges/${assessmentId}/VendorAssessment`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
