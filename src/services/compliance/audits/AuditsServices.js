import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'
import Swal from 'sweetalert2'

export const getSingleAudit = (auditId, successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit/${auditId}`, 'get', null, {})
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

export const getAudits = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.audits)
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

export const getInternalAudits = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}assessment/getAssessment`, 'get', null, {})
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

export const getAuditStatusByFrameworkId = (frameworkId, framework_Name) => {
  return apiHelper(`${authConfig.complianceDevRakshitah_base_url}audit/status/${frameworkId}`, 'get', null, {})
    .then(res => {
      return [framework_Name, res.data.closedFindings, res.data.totalFinding - res.data.closedFindings]
      // return { frameworkId, ...res.data.data }
    })
    .catch(err => {
      console.error(`Error fetching status report for framework ID ${frameworkId}:`, err)

      return null // Return null or handle the error as needed
    })
}
