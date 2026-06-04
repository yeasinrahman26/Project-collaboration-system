"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, setDarkMode } from "../redux/slices/uiSlice";
import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode from localStorage (only on client)
  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      dispatch(setDarkMode(JSON.parse(storedDarkMode)));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      dispatch(setDarkMode(prefersDark));
    }
  }, [dispatch]);

  // Apply dark mode to document
  useEffect(() => {
    if (!mounted) return;

    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode, mounted]);

  const toggleDark = () => {
    dispatch(toggleDarkMode());
  };

  if (!mounted) {
    return {
      darkMode: false,
      toggleDarkMode: () => {},
    };
  }

  return {
    darkMode,
    toggleDarkMode: toggleDark,
  };
};
