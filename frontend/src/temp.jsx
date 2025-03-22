// authGuard.ts
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "./axiosInstance";
import { useState } from "react";

export function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const checkSession = () => {
    setUser(localStorage.getItem("data"));
    console.log(localStorage.getItem("data"));
    setLoading(false);
  };

  const publicPaths = ["/login", "/signup", "/"];

  React.useEffect(() => {
    const checkRoute = async () => {
      // Handle public routes
      checkSession();

      if (publicPaths.includes(location.pathname)) {
        return;
      }
      // Handle protected routes
      if (!localStorage.getItem("data")) {
        navigate("/login");
      } else {
      }
    };

    checkRoute();
  }, [location.pathname, navigate]);

  return null;
}
