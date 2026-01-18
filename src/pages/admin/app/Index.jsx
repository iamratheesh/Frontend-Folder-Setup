import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./Index.routes";
import AppLayout from "@/layouts/AppLayout/AppLayout";
import Loader from "@/components/Loader/Loader";

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AppLayout />}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Index;