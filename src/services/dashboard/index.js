import authConfig from 'configs/auth'
import apiHelper, { encryptionDecryptionApiHelper } from 'store/apiHelper'

export const getOverallSingleVendorStauts = async (vendorId, successCallback, setLoading) => {
  return apiHelper(
    `${authConfig.complianceDevRakshitah_base_url}vendor/getOverallGroupStatus/${vendorId}`,
    'get',
    null,
    {}
  )
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

export const getOverallVendorStauts = async (successCallback, setLoading) => {
  return apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getGroupStatus`, 'get', null, {})
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

export const getOverallVendorAssessmentStatus = async (successCallback, setLoading) => {
  return apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getGroupQuestions`, 'get', null, {})
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

export const getRiskByCategory = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/getRiskByCategory`, 'get', null, {})
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

export const getFrameWorkAudit = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/getFrameWorkAudit`, 'get', null, {})
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

export const getTopVal = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/getTopVal`, 'get', null, {})
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

export const getRiskScore = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/getRiskScore`, 'get', null, {})
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

export const getControlStatusByFrameWork = (successCallback, setLoading) => {
  apiHelper(`${authConfig.riskDevRakshitah_base_url}dashboard/getControlStatusByFrameWork`, 'get', null, {})
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

export const getVendorAssessmentCount = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendorAssessment/getAssessmentCount`, 'get', null, {})
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

export const getVendorHeatmap = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendorAssessment/getHeatmap`, 'get', null, {})
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

export const getDashboardSecureData = (successCallback, setLoading) => {
  encryptionDecryptionApiHelper(`${authConfig.complianceDevRakshitah_base_url}dashBoard/secure-data`, 'get', null, {})
    .then(res => {
      successCallback(res)
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
