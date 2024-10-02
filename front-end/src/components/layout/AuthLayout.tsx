import React from "react";
import { Navigate } from "react-router-dom";
import { configure } from "axios-hooks";
import Axios from "axios";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");

  if (token) {
    const axios = Axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    configure({
      axios: axios,
    });
  }

  return token ? children : <Navigate to="/login" replace />;
}
