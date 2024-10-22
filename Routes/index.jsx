import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// redux
import {
  adminProtectedRoutes,
  authProtectedRoutes,
  publicRoutes,
} from "./routes";
import { AdminProtected, AuthProtected, LoginProtected } from "./AuthProtected";
import DemoLayout from "../src/components/layouts/DemoLayout";
import AdminLayout from "../src/components/layouts/AdminLayout";
import { loadUserData } from "../stores/auth/authUserSlice";
import { CustomToast } from "../src/components/Cards/Toast";
import { useToastContext } from "../Hooks/ToastContextHook";
import Error404 from "../Pages/Error/Error404";
import AdminSkeleton from "../src/components/Skeletons/AdminSkeleton";

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Suspense>
                  <LoginProtected>{route.component}</LoginProtected>
                </Suspense>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {authProtectedRoutes.map((route, idx) => {
            return (
              <Route
                path={route.path}
                element={
                  <AuthProtected>
                    <DemoLayout content={route.component} />
                  </AuthProtected>
                }
                key={idx}
                exact={true}
              />
            );
          })}
        </Route>

        <Route>
          {adminProtectedRoutes.map((route, idx) => {
            return (
              <Route
                path={route.path}
                element={
                  <AuthProtected>
                    <AdminProtected>
                      <Suspense fallback={<AdminSkeleton />}>
                        <AdminLayout content={route.component} />
                      </Suspense>
                    </AdminProtected>
                  </AuthProtected>
                }
                key={idx}
                exact={true}
              />
            );
          })}
        </Route>

        <Route path={"*"} element={<Error404 />} exact={true} />
      </Routes>
      <CustomToast />
    </>
  );
};

export default Index;
