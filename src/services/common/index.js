import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'
// https://iac-rakshitah-dev.politeforest-c2818b6a.southeastasia.azurecontainerapps.io/iam/teams

export const getLabelName = (id, successCallback) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}get/${id}`, 'get')
    .then(res => {
      successCallback(res.data.lookupName)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getControlOwner = (id, successCallback) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}users/getAll`, 'get')
    .then(res => {
      const user = res.data.find(user => user.id === id)
      successCallback(user)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getControlClassDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/2`, 'get')
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

export const getVulnerabilityType = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/50`, 'get')
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

export const getSeverityRating = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/52`, 'get')
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

export const getLikelyHood = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/32`, 'get')
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

export const getRiskValue = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/51`, 'get')
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

export const getControlPhaseDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/3`, 'get')
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

export const getControlMaturityDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/4`, 'get')
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

export const getControlPriorityDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/5`, 'get')
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

export const getControlTypeDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/6`, 'get')
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

export const getControlFamilyDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/7`, 'get')
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

export const getControlStatusDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/8`, 'get')
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

export const getDocumentTypeDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/9`, 'get')
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

export const getDocumentStatusDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/10`, 'get')
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

export const getCategoryDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/12`, 'get')
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

export const getRiskSourceDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/13`, 'get')
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

export const getSiteLocationDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/14`, 'get')
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

export const getRiskScoreDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/15`, 'get')
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

export const getCurrentLikelyHoodDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/16`, 'get')
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

export const getCurrentImpactDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/17`, 'get')
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

export const getTechnologyDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/19`, 'get')
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

export const getRiskStatusDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/20`, 'get')
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

export const getStrategyDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/21`, 'get')
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

export const getEffortsDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/22`, 'get')
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

export const getNextStepsDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/25`, 'get')
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

export const getAuditStatusDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/26`, 'get')
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

export const getTestResultDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/27`, 'get')
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

export const getRiskDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/28`, 'get')
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

export const getThreatDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/29`, 'get')
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

export const getAdequacyDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/30`, 'get')
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

export const getAssessmentStatusDropdown = (successCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/31`, 'get')
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

export const getLikelyHoodDropdown = (successCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/32`, 'get')
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

export const getImpactDropdown = (successCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/33`, 'get')
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

export const getFindingStatusDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/34`, 'get')
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

export const getAssetCategoryDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/35`, 'get')
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

export const getRiskCategoryDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/36`, 'get')
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

export const getVulnerabilityLevelDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/37`, 'get')
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

export const getPlannedControlRatingDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/38`, 'get')
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

export const getImplementationStatusDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/39`, 'get')
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

export const getColorValues = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/41`, 'get')
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

export const getAssetTypeDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/42`, 'get')
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

export const getFrequencyDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/43`, 'get')
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

export const getStatusForFindingsDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/44`, 'get')
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

export const getControlStrengthDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/45`, 'get')
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

export const getEntityTypeDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/46`, 'get')
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

export const getActionTypeDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/47`, 'get')
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

export const getNotificationFrequencyDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/48`, 'get')
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

export const getNotificationTypeDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/49`, 'get')
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

export const getCriticalDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/53`, 'get')
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

export const getVendorTypeDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/54`, 'get')
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

export const getServiceDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/55`, 'get')
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

export const getVendorStatusDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/56`, 'get')
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

export const getVendorCategoryDropdown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.commonDevRakshitah_base_url}category/57`, 'get')
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

export const getControlDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}controls/get`, 'get')
    .then(res => {
      successCallback(res.data.data.controls)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback()
      }
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getControlRegulationDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}frameworks/getAll`, 'get')
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

export const getFrameworkDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}frameworks/getAll`, 'get')
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

export const getTeamDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}teams`, 'get')
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

export const getBase64StringFromFileId = fileId => {
  return apiHelper(`${authConfig.authDevRakshitah_base_url}storage/getFileString/${fileId}?provider=azure`, 'get')
}

export const getAllNotifications = (successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}notification/getAll`, 'get')
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

export const getAdditionlStakeHoldersDropDown = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}users/getAll`, 'get')
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

export const getAdditionalStakeHoldersForVendor = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getAllUser&isAvailable`, 'get')
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

export const getAllRoles = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}roles`, 'get')
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

export const getUsersGroupedByRoles = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}roles/getUsersGroupedByRoles`, 'get')
    .then(res => {
      successCallback(res.data.roles)
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

export const getAllClaims = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}roles/claims`, 'get')
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

export const uploadFile = async (payload, setLoading, successCallback, errorCallback) => {
  await apiHelper(`${authConfig.authDevRakshitah_base_url}storage/uploadFile?provider=azure`, 'post', payload)
    .then(res => {
      console.log(res)
      if (successCallback) {
        successCallback(res?.data?.fileId * 1 || null)
      }
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      if (errorCallback) {
        errorCallback(err)
      }
      if (setLoading) {
        setLoading(false)
      }
      console.log(err)
    })
}

export const getAdditionlStakeHoldersById = (id, successCallback, setLoading) => {
  apiHelper(`${authConfig.authDevRakshitah_base_url}users/getById/${id}`, 'get', {}, {})
    .then(res => {
      successCallback(res.data)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(error => {
      console.error(error)
      if (setLoading) {
        setLoading(false)
      }
    })
}

export const getFrameworkDropdownForVendor = (successCallback, setLoading) => {
  apiHelper(`${authConfig.complianceDevRakshitah_base_url}vendor/getFramework`, 'get')
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
