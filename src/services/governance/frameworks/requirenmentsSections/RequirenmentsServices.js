import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getControlsByRequirenmentId = (requirementId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}requirement/${requirementId}/control`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.controls)
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
