import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getRisks = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}risks/get`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.risk)
      setLoading && setLoading(false)
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getSingleRisk = (id, errorCallback, successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}risks/${id}`, 'get')
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

export const getColors = (successCallback, setLoading, filters) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}rule/Getall`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      setLoading && setLoading(false)
    })
    .catch(err => {
      console.log(err)
      if (setLoading) {
        setLoading(false)
      }
    })
}
