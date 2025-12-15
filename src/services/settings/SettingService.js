import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getAllRules = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}rule/GetallRiskCategorizationRules`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback()
      }
      console.log(err)
    })
}

export const deleteSingleRule = (ruleID, successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}rule/delete/${ruleID}`, 'delete', null, {})
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback()
      }
      console.log(err)
    })
}

export const getAllNotificationRules = (userId, successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}notificationConfig/getAllByUserId/${userId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) setLoading(false)
    })
    .catch(err => {
      if (setLoading) setLoading(false)
      console.log(err)
    })
}

export const getSingleNotificationRule = (ruleId, successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}notificationConfig/getByconfigId/${ruleId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data[0])
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const deleteNotificationConfig = (configId, successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}notificationConfig/deleteConfig/${configId}`, 'delete', null, {})
    .then(res => {
      successCallback(res.data.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      if (setLoading) {
        setLoading(false)
      }
      console.log(err)
    })
}

export const getAllIntegrations = (successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}integration/getAllTypes`, 'get', null, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) setLoading(false)
    })
    .catch(err => {
      if (setLoading) setLoading(false)
      console.log(err)
    })
}

export const getAllCongisByIntegrationId = (integrationId, successCallback, setLoading) => {
  apiHelper(
    `${authConfig.authDevRakshitah_base_url}integration/getAllConfigsByIntegId?integrationId=${integrationId}`,
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
    })
}
