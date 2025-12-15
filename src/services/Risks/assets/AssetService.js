import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getAllAssets = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/getAll`, 'get', null, {})
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

export const getSingleAsset = (assetId, successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/get/${assetId}`, 'get', null, {})
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

export const calculateAssetValue = async (payload, successCallback, errorCallback, setLoading) => {
  await apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/currentRating`, 'post', payload, {})
    .then(res => {
      successCallback(res.data.data.assetValue)
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

export const getAssetRating = async (assetId, successCallback, errorCallback, setLoading) => {
  await apiHelper(`${authConfig.riskDevRakshitah_base_url}assert/get/${assetId}`, 'get')
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
