// *Axios
import axios from 'axios'

const addToken = headers => {
  let accessToken = localStorage.getItem('accessToken') || null
  if (accessToken != null && !('Authorization' in headers)) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  return headers
}

const addContentType = (headers, value) => {
  if (!('Content-Type' in headers)) {
    headers['Content-Type'] = value
  }

  return headers
}

export const siteCall = async (url, method, body, successCallback, errorCallback, headers) => {
  var method = method || 'GET'
  var body = body || {}
  var headers = headers || {}
  headers = addToken(headers)
  headers = addContentType(headers, 'application/json')

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: body
  })
    .then(response => {
      return successCallback(response)
    })
    .catch(error => {
      return errorCallback(error)
    })
}
