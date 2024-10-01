import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Index from "./routes/index";
import Login from "./routes/login";
import AuthLayout from "./components/layout/AuthLayout";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <AuthLayout>
        <Index />
      </AuthLayout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
