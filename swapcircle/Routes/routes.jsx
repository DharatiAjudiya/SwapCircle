import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { itemData } from "../Data/items";
import ContactSkeleton from "../src/components/Skeletons/ContactSkeleton";
import LoginSkeleton from "../src/components/Skeletons/LoginSkeleton";
import RegisterSkeleton from "../src/components/Skeletons/RegisterSkeleton";
import ProfileSkeleton from "../src/components/Skeletons/ProfileSkeleton";
import ItemDetailSkeleton from "../src/components/Skeletons/ItemDetailSkeleton";
import AddItemSkeleton from "../src/components/Skeletons/AddItemSkeleton";
import ProductSkeleton from "../src/components/Skeletons/ProductSkeleton";
import SwapHistorySkeleton from "../src/components/Skeletons/SwapHistorySkeleton";
import ChatSkeleton from "../src/components/ChatSkeleton";
import HomeSkeleton from "../src/components/Skeletons/HomeSkeleton";
import AdminSkeleton from "../src/components/Skeletons/AdminSkeleton";
import TableSkeleton from "../src/components/Skeletons/Layout/TableSkeleton";

const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));

const Home = lazy(() => import("../Pages/Home"));
const Product = lazy(() => import("../Pages/Product"));
const ItemDetail = lazy(() => import("../Pages/ItemDetail"));
const Profile = lazy(() => import("../Pages/Profile"));
const Contact = lazy(() => import("../Pages/Contact"));
const Chat = lazy(() => import("../Pages/Chat"));
const AddItem = lazy(() => import("../Pages/AddItem"));
const EditItem = lazy(() => import("../Pages/EditItem"));
const SwapHistory = lazy(() => import("../Pages/SwapHistory"));

const Users = lazy(() => import("../Pages/Admin/Users"));
const Items = lazy(() => import("../Pages/Admin/Items"));
const Category = lazy(() => import("../Pages/Admin/Categories"));
const Swaps = lazy(() => import("../Pages/Admin/Swaps"));

const authProtectedRoutes = [
  //dashboard
  {
    path: "/",
    component: (
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    ),
  },

  // Calender
  {
    path: "/item/:id",
    component: (
      <Suspense fallback={<ItemDetailSkeleton />}>
        <ItemDetail data={itemData} />
      </Suspense>
    ),
  },
  {
    path: "/item/create",
    component: (
      <Suspense fallback={<AddItemSkeleton />}>
        <AddItem />
      </Suspense>
    ),
  },
  {
    path: "/item/edit/:id",
    component: (
      <Suspense fallback={<AddItemSkeleton />}>
        <EditItem />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    component: (
      <Suspense fallback={<ContactSkeleton />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/shop",
    component: (
      <Suspense fallback={<ProductSkeleton />}>
        <Product />
      </Suspense>
    ),
  },
  {
    path: "/shop/:id",
    component: (
      <Suspense fallback={<ProductSkeleton />}>
        <Product />
      </Suspense>
    ),
  },
  {
    path: "/swap/history",
    component: (
      <Suspense fallback={<SwapHistorySkeleton />}>
        <SwapHistory />
      </Suspense>
    ),
  },

  // Profile
  {
    path: "/profile",
    component: (
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/user/profile/:id",
    component: (
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    component: (
      <Suspense fallback={<ChatSkeleton />}>
        <Chat />
      </Suspense>
    ),
  },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/" state={{ from: window.location.pathname }} />,
  },
];

const publicRoutes = [
  // Authentication Page
  {
    path: "/login",
    component: (
      <Suspense fallback={<LoginSkeleton />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    component: (
      <Suspense fallback={<RegisterSkeleton />}>
        <Register />
      </Suspense>
    ),
  },

  // { path: "/home", component: <Home /> },

  // { path: "/forgot-password", component: <ForgetPasswordPage /> },
  // // Authentication Inner Pages
  // { path: "/auth-login", component: <Login1 /> },
  // { path: "/auth-register", component: <Register1 /> },
  // { path: "/auth-recoverpw", component: <RecoverPassword /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },

  // // Utility Pages
  // { path: "/pages-404", component: <Error404 /> },
  // { path: "/pages-500", component: <Error500 /> },
  // { path: "/pages-maintenance", component: <Maintenance /> },
  // { path: "/pages-comingsoon", component: <ComingSoon /> },
];

const adminProtectedRoutes = [
  // { path: "/dashboard", component: <Dashboard /> },
  {
    path: "/admin",
    exact: true,
    component: (
      <Navigate to="/admin/user" state={{ from: window.location.pathname }} />
    ),
  },

  {
    path: "/admin/user",
    component: (
      <Suspense fallback={<TableSkeleton />}>
        <Users />
      </Suspense>
    ),
  },
  {
    path: "/admin/item",
    component: (
      <Suspense fallback={<TableSkeleton />}>
        <Items />
      </Suspense>
    ),
  },
  {
    path: "/admin/category",
    component: (
      <Suspense fallback={<TableSkeleton />}>
        <Category />
      </Suspense>
    ),
  },
  {
    path: "/admin/swap",
    component: (
      <Suspense fallback={<TableSkeleton />}>
        <Swaps />
      </Suspense>
    ),
  },
];

export { authProtectedRoutes, publicRoutes, adminProtectedRoutes };
