import { CommonSwal } from 'components/CommonSwal'
import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getReviews = (riskId, successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}risk/${riskId}/reviews`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      successCallback([])
      if (setLoading) {
        setLoading(false)
      }
      console.log(err)
    })
}

export const getSingleReview = (reviewId, successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}get/${reviewId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      successCallback([])
      if (setLoading) {
        setLoading(false)
      }
      console.log(err)
    })
}

export const getUsers = (successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}users/getAll`, 'get', null, {})
    .then(res => {
      successCallback(res.data || [])
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.error('Failed to fetch users', err)
      successCallback([])
      if (setLoading) {
        setLoading(false)
      }
    })
}