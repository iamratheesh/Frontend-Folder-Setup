import { ROUTES } from "@/config/constants";
import { pages } from "../PageImport";
import ProtectedRoute from "@/helper/ProtectedRoute";
import AuthRoute from "@/helper/AuthRoute";

export const  AdminRoutes = [
  // Auth pages
  {
    path: `${ROUTES.ADMIN.AUTH}/login`,
    element: <AuthRoute element={<pages.admin.LoginPage />} requiredRole="admin" />,
  },
  
 

  // Main app dashboard (protected)
  {
    path: `${ROUTES.ADMIN.APP}`,
    element: (
      <ProtectedRoute element={<pages.admin.AdminPageIndex />} requiredRole="admin" />
    ),
  },
  {
    path: `${ROUTES.ADMIN.AUTH}/logout`,
    element: (
      <ProtectedRoute element={<pages.admin.LogoutPage />} requiredRole="admin" />
    ),
  },
];
