import { useAuth } from 'store/auth/AuthContext'

const useMainModulePermission = (subModules = []) => {
  const { claims } = useAuth()

  if (!Array.isArray(claims)) {
    return { hasAccessToMainModule: undefined }
  }

  const isAllowed = value => {
    if (!value) return false
    if (Array.isArray(value)) {
      return value.some(v => v === 'read' || v === 'write')
    }

    return value === 'read' || value === 'write'
  }

  // ✅ Check if ANY submodule is allowed
  const hasAllowedSub = subModules.some(subModule => {
    const claim = claims.find(claim => claim.type === subModule)

    return isAllowed(claim?.value)
  })

  return { hasAccessToMainModule: hasAllowedSub }
}

export default useMainModulePermission
