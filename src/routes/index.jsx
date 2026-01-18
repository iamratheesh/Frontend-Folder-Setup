import React from "react";
import { Routes, Route } from "react-router-dom";
import Notifications from "@/components/alertSnackbar/Notifications";
import { CollegeRoutes } from "./role/College.routes";
import { StudentRoutes } from "./role/Student.routes";
import { CompanyRoutes } from "./role/Company.routes";
import { AdminRoutes } from "./role/Admin.routes";

const allRoutes = [
  ...CollegeRoutes,
  ...StudentRoutes,
  ...CompanyRoutes,
  ...AdminRoutes,
];

const AppRoutes = () => (
  <div className="containerStyle">
    <div className="innerContainerStyle">
      <Notifications />
      <Routes>
        {allRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  </div>
);

export default AppRoutes;
