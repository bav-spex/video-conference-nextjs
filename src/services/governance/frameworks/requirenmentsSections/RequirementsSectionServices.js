import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getRequirenmentSectionsByFrameworkId = (frameworkId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}requirementsection/framework/${frameworkId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.requirementsectionsgroup)
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
