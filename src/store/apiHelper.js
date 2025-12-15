import axios from 'axios'
import auth from 'configs/auth'
import { decryptData } from 'utils/routingEncryption'

const apiHelper = async (apiURL, method, data, customHeader, responseType = 'json') => {
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)
  let url = apiURL

  let headers = {
    Authorization: `Bearer ${storedToken}`,
    ...customHeader
  }

  // Create Basic Auth header
  //const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;
  //headers.Authorization = basicAuth;

  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      responseType: responseType
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.error(err.response || err.message)
        reject(err)
      })
  })
}

export const encryptionDecryptionApiHelper = async (apiURL, method, data, token, responseType = 'json') => {
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)
  let url = apiURL

  let headers = {
    Authorization: `Bearer ${storedToken}`
  }

  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      responseType: responseType
    })
      .then(res => {
        resolve(decryptData(res.data))
      })
      .catch(err => {
        console.error(err.response || err.message)
        reject(err)
      })
  })
}

export default apiHelper
