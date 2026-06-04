import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.set("token", token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get("token");
};

export const removeAuthToken = () => {
  Cookies.remove("token");
};

export const setUserData = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserData = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUserData = () => {
  localStorage.removeItem("user");
};
