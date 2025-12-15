import useModulePermission from "hooks/useModulePermission";
import { Navigate } from "react-router-dom";

//  Component to restrict access to specific modules based on user permissions.
//  If the user does not have access, they are redirected to the home page.

const PermitForModuleContentOnly = ({ module, children, }) => {
  // Get module access permission status
  const { hasAccessToModule } = useModulePermission(module);

  // If permission is still loading, return false (prevents rendering unauthorized content)
  if (hasAccessToModule === undefined) return false;

  // If user lacks permission, redirect to the home page
  if (hasAccessToModule === false) return <Navigate to={"/"} />;

  // Render children if user has access
  return <>{children}</>;
};

export default PermitForModuleContentOnly;
