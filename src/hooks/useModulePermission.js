import { useAuth } from 'store/auth/AuthContext'

const useModulePermission = module => {
  const { claims } = useAuth()

  // Ensure claims is available and is an array
  if (!Array.isArray(claims)) {
    return { hasAccessToModule: undefined }
  }

  const claim = claims.find(claim => claim.type === module)
  const value = claim?.value

  if (value === 'write' || value === 'read') {
    return { hasAccessToModule: true }
  }

  return { hasAccessToModule: undefined }
}

export default useModulePermission
