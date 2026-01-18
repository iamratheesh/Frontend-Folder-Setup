import { lazy } from "react";

// Static, lazy imports
export const pages = {

  admin: {
    LoginPage: lazy(() => import("../pages/admin/auth/login/Login")),
    AdminPageIndex: lazy(() => import("../pages/admin/app/Index")),
    LogoutPage: lazy(() => import("../pages/student/auth/logout/Logout")),

  },

};
