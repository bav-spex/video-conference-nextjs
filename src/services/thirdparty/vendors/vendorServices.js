import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getAllVendors = async (successCallback, setLoading) => {
  await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getAll`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
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

export const getAllVendorForDashboard = async (successCallback, setLoading) => {
  await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getAllVendorForDashboard`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
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

export const getSingleVendor = async (vendorId, successCallback, setLoading) => {
  await apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/${vendorId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
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
