import { formatDistanceToNow, format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatTime = (date) => {
  return format(new Date(date), "HH:mm");
};

export const formatDateTime = (date) => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};
