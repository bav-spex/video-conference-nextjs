import { createContext, useContext, useEffect, useState } from 'react'

import axios from 'axios'
import authConfig from 'configs/auth'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'next/router'
import apiHelper from 'store/apiHelper'

// ** Defaults
const defaultProvider = {
  user: null,
  claims: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  twoFactorAuthentication: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [claims, setClaims] = useState(defaultProvider.claims)

  // ** Hooks
  const router = useRouter()

  const getOrganisations = () => {
    apiHelper(`${authConfig.authDevRakshitah_base_url}organizations`, 'get', null, {})
      .then(res => {
        window.localStorage.setItem('organisationsData', JSON.stringify(res.data))
      })
      .catch(err => {
        // router.push('/home/riskManagement/risks')
        console.log(err)
      })
  }

  const initAuth = async () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    const user = JSON.parse(localStorage.getItem('userData'))
    let decoded
    if (storedToken) {
      // if (user && user.organizations && user.organizations.length > 1) {
      //   router.push('/organisations')
      // } else if (user && user.organizations && user.organizations.length === 1) {
      // }
      await apiHelper(
        `${authConfig.authDevRakshitah_base_url}authenticate/me?orgId=${user.currentorg}`,
        'get',
        null,
        {}
      )
        .then(response => {
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          decoded = jwt_decode(response.data.accessToken)
          // TODO Ashutosh Sir Setting up Claims
        })
        .catch(err => {
          console.log(err)
          localStorage.removeItem('accessToken')
          setLoading(false)
          router.push('/login')
          // router.push('/dashboard')
        })

      // Make the GET request directly with axios
      await apiHelper(`${authConfig.authDevRakshitah_base_url}roles`, 'get')
        .then(res => {
          const roleName = res.data.find(item => item.roleId === user.roleId).role
          const newUser = { ...user, role: roleName }
          setUser(newUser)
          window.localStorage.setItem('userData', JSON.stringify(newUser))

          const newClaims = {
            dashboard: decoded.dashboard ?? 'none',
            vendorDashboard: decoded.vendorDashboard ?? 'none',
            vendorReviewerDashboard: decoded.vendorReviewerDashboard ?? 'none',
            frameworks: decoded.frameworks ?? 'none',
            controls: decoded.controls ?? 'none',
            documents: decoded.documents ?? 'none',
            riskManagementDashboard: decoded.riskManagementDashboard ?? 'none',
            risks: decoded.risks ?? 'none',
            assets: decoded.assets ?? 'none',
            complianceDashboard: decoded.complianceDashboard ?? 'none',
            internalAudits: decoded.internalAudits ?? 'none',
            externalAudits: decoded.externalAudits ?? 'none',
            correctiveActions: decoded.correctiveActions ?? 'none',
            vendors: decoded.vendors ?? 'none',
            // vendorDrilldown: decoded.vendorDrilldown ?? 'none',
            vendorWizard: decoded.vendorWizard ?? 'none',
            vendorAssessment: decoded.vendorAssessment ?? 'none',
            vendorFramework: decoded.vendorFramework ?? 'none',
            vulnerabilityManagementDashboard: decoded.vulnerabilityManagementDashboard ?? 'none',
            vulnerabilityManagement: decoded.vulnerabilityManagement ?? 'none',
            lookups: decoded.lookups ?? 'none',
            users: decoded.users ?? 'none',
            roles: decoded.appRoles ?? 'none',
            teams: decoded.appTeams ?? 'none',
            riskCategorization: decoded.riskCategorization ?? 'none',
            profile: decoded.profile ?? 'none',
            organisations: decoded.organisations ?? 'none',
            notificationRules: decoded.notificationRules ?? 'none',
            integrations: decoded.integrations ?? 'none'
          }

          const finalClaims = Object.keys(newClaims).map(item => {
            return { type: item, value: newClaims[item] }
          })
          setClaims(finalClaims)
          if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'client-admin') {
            router.push('/home/vendorReviewerDashboard')
          } else if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'vendor-user') {
            router.push('/home/vendorDashboard')
          } else {
            // router.push('/dashboard')
            router.push('/')
          }

          getOrganisations()
        })
        .catch(err => {
          console.error('API call failed:', err.response || err.message)
          // Optional redirect
          // router.push('/home/riskManagement/risks');
        })
    } else {
      router.push('/login')
      // router.push('/dashboard')

      localStorage.removeItem(authConfig.storageTokenKeyName)
      // setLoading(false)
    }
  }

  useEffect(() => {
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    const authParams = { Username: params.username, Password: params.password }
    apiHelper(`${authConfig.authDevRakshitah_base_url}authenticate/login`, 'post', authParams, {})
      .then(res => {
        if (res.data.userData?.mustResetPassword === true) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
          window.localStorage.setItem('userData', JSON.stringify(res.data.userData))

          router.push('/reset-password')

          return
        }

        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)

        var decoded = jwt_decode(res.data.accessToken)

        const newUser = {
          ...res.data.userData,
          roleId: res.data.userData.roleId[0],
          role: res.data.userData.roleId[0],
          organizations: decoded.organizations.split(', '),
          currentorg: decoded.currentorg
        }
        window.localStorage.setItem('userData', JSON.stringify(newUser))
        setUser(newUser)
        setLoading(false)
        initAuth()
        // successCallback(res.data.data.risk)
      })
      .catch(err => {
        console.log(err?.response)

        if (errorCallback) {
          const status = err?.response?.status
          const title = err?.response?.data?.title?.toLowerCase() || ''
          //const title = 'email'

          const message =
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            'Login failed. Please check your credentials.'

          let field = 'general'

          // Improved condition
          if (title.includes('email') || title.includes('username')) {
            field = 'email'
          } else if (title.includes('password')) {
            field = 'password'
          }

          errorCallback({ field, message })
        }
      })
  }

  const handleLogout = () => {
    setUser(null)
    setClaims(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
    // router.push('/dashboard')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(`${authConfig.authDevRakshitah_base_url}authenticate/register`, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const handleTwoFactorAuthentication = (params, errorCallback) => {
    const authParams = { Username: params.username, Password: params.password }
    apiHelper(`${authConfig.authDevRakshitah_base_url}authenticate/validateSmtp`, 'post', authParams, {})
      .then(res => {})
      .catch(err => {
        console.log(err?.response)

        if (errorCallback) {
          const status = err?.response?.status
          const title = err?.response?.data?.title?.toLowerCase() || ''
          //const title = 'email'

          const message =
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err?.message ||
            'Two Factor Authentication failed. Please check your credentials.'

          let field = 'general'

          // Improved condition
          if (title.includes('email') || title.includes('username')) {
            field = 'email'
          } else if (title.includes('password')) {
            field = 'password'
          }

          errorCallback({ field, message })
        }
      })
  }

  const values = {
    user,
    claims,
    loading,
    setUser,
    setLoading,
    twoFactorAuthentication: handleTwoFactorAuthentication,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthProvider }

export const useAuth = () => useContext(AuthContext)
