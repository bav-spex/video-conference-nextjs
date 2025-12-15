import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getSingleControl = (controlId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}controls/id/${controlId}`, 'get', null, {})
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

export const getAllControls = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}controls/get`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.controls)
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

export const getArtifactsByControlId = (controlId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}controls/${controlId}/artifacts`, 'get', null, {})
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
