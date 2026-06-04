"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
} from "../redux/services/authApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
} from "../redux/slices/authSlice";
import {
  setAuthToken,
  removeAuthToken,
  setUserData,
  removeUserData,
  getAuthToken,
} from "../utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !getAuthToken(),
    },
  );

  // Initialize auth from cookies
  useEffect(() => {
    const token = getAuthToken();
    if (token && !auth.isAuthenticated) {
      // Token exists, user will be loaded via useGetProfileQuery
    }
  }, []);

  // Update user when profile is loaded
  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [profile, dispatch]);

  const login = async (email, password) => {
    try {
      dispatch(loginStart());
      const response = await loginMutation({ email, password }).unwrap();
      dispatch(loginSuccess(response));
      setAuthToken(response.token);
      setUserData(response.user);
      router.push("/dashboard");
      return response;
    } catch (error) {
      dispatch(loginFailure(error.data?.message || "Login failed"));
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      dispatch(loginStart());
      const response = await signupMutation({ name, email, password }).unwrap();
      dispatch(loginSuccess(response));
      setAuthToken(response.token);
      setUserData(response.user);
      router.push("/dashboard");
      return response;
    } catch (error) {
      dispatch(loginFailure(error.data?.message || "Signup failed"));
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    removeAuthToken();
    removeUserData();
    router.push("/login");
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || isProfileLoading,
    error: auth.error,
    login,
    signup,
    logout: logoutUser,
  };
};
