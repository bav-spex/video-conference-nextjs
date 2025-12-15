import useMainModulePermission from 'hooks/useMainModulePermission'
import { Navigate } from 'react-router-dom'

// Component to restrict access to specific modules based on user permissions.
const PermitForMainModuleContentOnly = ({ subModules, children }) => {
  // ✅ Pass both arguments (even though module isn’t checked, for consistency)
  const { hasAccessToMainModule } = useMainModulePermission(subModules)

  // While permissions are still loading → render nothing
  if (hasAccessToMainModule === undefined) return null

  // If user lacks permission → redirect
  if (hasAccessToMainModule === false) return null

  // ✅ Render children if user has access
  return <>{children}</>
}

export default PermitForMainModuleContentOnly
