import authConfig from 'configs/auth'
import apiHelper, { encryptionDecryptionApiHelper } from 'store/apiHelper'

export const getAllVendorFrameworks = async (successCallback, setLoading) => {
  await encryptionDecryptionApiHelper(
    `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/frameworks`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res)
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

export const getSingleVendorFramework = (vendorFrameworkId, successCallback, setLoading) => {
  apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}vendorAssessment/frameworks/getFramework/${vendorFrameworkId}`,
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
      if (setLoading) {
        setLoading(false)
      }
    })
}
