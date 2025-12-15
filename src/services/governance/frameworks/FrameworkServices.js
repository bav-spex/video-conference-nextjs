import auth from 'configs/auth'
import apiHelper, { encryptionDecryptionApiHelper } from 'store/apiHelper'

export const getAllFrameworks = (successCallback, setLoading) => {
  apiHelper(`${auth.governanceDevRakshitah_base_url}frameworks/getAll`, 'get', null, {})
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

export const getSingleFramework = (frameworkId, successCallback, setLoading) => {
  apiHelper(`${auth.governanceDevRakshitah_base_url}frameworks/get/${frameworkId}`, 'get', null, {})
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

export const getFrameworkStatusReportById = async id => {
  try {
    const res = await apiHelper(
      `${auth.governanceDevRakshitah_base_url}frameworks/status-report/${id}`,
      'get',
      null,
      {}
    )

    return res.data
  } catch (err) {
    console.error(`Error fetching framework status report:`, err)

    return null // Return null or handle the error as needed
  }
}

export const getAllSectionsForSoa = (fremeworkId, filterType, successCallback, setLoading) => {
  apiHelper(
    `${auth.governanceDevRakshitah_base_url}frameworks/get-controlsForSop/${fremeworkId}/${filterType}`,
    'get',
    null,
    {}
  )
    .then(res => {
      successCallback(res.data?.sections)
      if (setLoading) {
        setLoading(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
