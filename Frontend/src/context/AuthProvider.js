import React, { createContext, useEffect } from 'react'
import { getIsAuth, signInUser } from '../api/auth';
import { useState } from 'react';
import { useNotification } from '../hooks';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,//the pending is when we make this request to the backend api if all goes right the user can instantly login otherwise he will wait because something goes wrong
  error: "",
}
export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const { updateNotification } = useNotification();

  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signInUser({ email, password });
    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    navigate("/", { replace: true });
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    localStorage.setItem("auth-token", user.token);//this is the place that storing the token with auth-token name
  };

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await getIsAuth(token);
    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  useEffect(() => {
    isAuth();
  }, []);

  //handleLogout 
  return (
    <AuthContext.Provider value={{ authInfo, handleLogin, handleLogout, isAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
