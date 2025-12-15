import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getTop10Risks = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/risksTop10`, 'get', null, {})
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

export const getMitigationStrategy = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/mitigations/strategies`, 'get', null, {})
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

export const getRiskAverageScore = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/average-score`, 'get', null, {})
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
