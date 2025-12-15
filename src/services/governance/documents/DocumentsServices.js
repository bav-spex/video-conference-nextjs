import authConfig from 'configs/auth'
import apiHelper from 'store/apiHelper'

export const getSingleDocument = (controlId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/id/${controlId}`, 'get', null, {})
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

export const deleteSingleDocument = (documentId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/delete/${documentId}`, 'delete', null, {})
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

export const getAllPolicies = (successCallback, errorCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/policies`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.documents)
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

export const getAllEvidences = (successCallback, errorCallback) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/evidences`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.documents)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getAllDocuments = (successCallback, errorCallback) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/policies`, 'get', null, {})
    .then(res => {
      successCallback([...res.data.data.documents])
    })
    .catch(err => {
      console.log(err)
    })
}

export const getDocumentSectionsByDocumentId = (documentId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/type/document/id/${documentId}`, 'get', null, {})
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

export const getSingleDocumentSection = (sectionId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}section/id/${sectionId}`, 'get', null, {})
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

export const getAreasBySectionId = (sectionId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/type/section/id/${sectionId}`, 'get', null, {})
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

export const getRequirementByAreaId = (areaId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/type/area/id/${areaId}`, 'get', null, {})
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

export const getRequirementData = (areaId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/type/requirement/id/${areaId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data.documentRequirement)
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

export const getControlsByDocumentId = (documentId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/document/${documentId}/controls`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data)
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

export const getFilesByDocumentId = (documentId, successCallback, setLoading) => {
  apiHelper(`${authConfig.governanceDevRakshitah_base_url}documents/id/${documentId}`, 'get', null, {})
    .then(res => {
      successCallback(res.data.data)
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

export const mapControlsToDocument = async (controlId, payload) => {
  try {
    const res = await apiHelper(
      `${authConfig.governanceDevRakshitah_base_url}documents/map/single/control/${controlId}`,
      'post',
      payload,
      {}
    )

    return { controlId, ...res.data.data }
  } catch (err) {
    console.error(`Error fetching status report for framework ID ${controlId}:`, err)

    return null // Return null or handle the error as needed
  }
}
