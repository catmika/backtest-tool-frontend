import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const About = lazy(() => import("@/pages/About"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root not found");
}

const container = createRoot(root);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/about", element: <About /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);

container.render(
  <React.StrictMode>
    <Suspense fallback={<div>LOADING...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
