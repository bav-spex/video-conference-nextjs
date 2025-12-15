import { getLocalStorage, removeLocalStorage, setBoolLocalStorage, setLocalStorage } from './set-get-local-storage'

export const setAuthToken = value => setLocalStorage(process.env.REACT_APP_TOKEN_NAME || `tATspy`, value, 24)

export const getAuthToken = () => getLocalStorage(process.env.REACT_APP_TOKEN_NAME || `tATspy`) || undefined

export const removeAuthToken = () => removeLocalStorage(process.env.REACT_APP_TOKEN_NAME || `tATspy`)

export const setAuthTokenType = value => setLocalStorage(process.env.REACT_APP_TOKEN_TYPE_NAME || `tATTspy`, value, 24)

export const getAuthTokenType = () => getLocalStorage(process.env.REACT_APP_TOKEN_TYPE_NAME || `tATTspy`) || undefined

export const removeAuthTokenType = () => removeLocalStorage(process.env.REACT_APP_TOKEN_TYPE_NAME || `tATTspy`, '', 24)

export const setUserDetails = value => setLocalStorage(process.env.REACT_APP_USER_DETAILS || `tUDspy`, value, 24)

export const getUserDetails = () => getLocalStorage(process.env.REACT_APP_USER_DETAILS || `tUDspy`) || undefined

export const removeUserDetails = () => removeLocalStorage(process.env.REACT_APP_USER_DETAILS || `tUDspy`)

export const setCurrentDeviceDetails = value =>
  setLocalStorage(process.env.REACT_APP_CURRENT_DEVICE_DETAILS || `tCDspy`, value, 24)

export const setUIDetails = value => setLocalStorage(process.env.REACT_APP_UI_DETAILS || `tUIDspy`, value, 24)

export const getUIDetails = () => getLocalStorage(process.env.REACT_APP_UI_DETAILS || `tUIDspy`) || undefined

export const removeUIDetails = () => removeLocalStorage(process.env.REACT_APP_UI_DETAILS || `tUIDspy`)

export const setUserLanguage = value => setLocalStorage(process.env.REACT_APP_USER_LANGUAGE || `tULspy`, value, 24)

export const getUserLanguage = () => getLocalStorage(process.env.REACT_APP_USER_LANGUAGE || `tULspy`) || undefined

export const removeUserLanguage = () => removeLocalStorage(process.env.REACT_APP_USER_LANGUAGE || `tULspy`)

export const setUserColorThemeMode = value =>
  setLocalStorage(process.env.REACT_APP_USER_COLOR_THEME_MODE || `tCUCTMspy`, value, 24)

export const getUserColorThemeMode = () =>
  getLocalStorage(process.env.REACT_APP_USER_COLOR_THEME_MODE || `tCUCTMspy`) || undefined

export const removeUserColorThemeMode = () =>
  removeLocalStorage(process.env.REACT_APP_USER_COLOR_THEME_MODE || `tCUCTMspy`)

export const cleanLocalStorage = () => {
  removeAuthToken()
  removeAuthTokenType()
  removeUserDetails()
  // removeCurrentDeviceDetails(); // To make sure user atfer logout user get their last selected device after login
  // removeTempCurrentDeviceDetails(); // To make sure user atfer logout user get their last selected device after login
  removeCurrentDeviceStatusSettings()
  removeQuickAccessView()
}

export const clearWholeLocalStorage = () => {
  removeAuthToken()
  removeAuthTokenType()
  removeUserDetails()
  removeQuickAccessView()
}
