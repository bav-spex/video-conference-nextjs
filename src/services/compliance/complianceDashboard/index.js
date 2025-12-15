import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getControlTestsDetails = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}dashBoard/control-tests/details`, 'get', null, {})
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

export const getComplianceSummary = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}dashBoard/compliance/summary`, 'get', null, {})
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
