import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import projectsSlice from "./slices/projectsSlice";
import tasksSlice from "./slices/tasksSlice";
import notificationsSlice from "./slices/notificationsSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectsSlice,
    tasks: tasksSlice,
    notifications: notificationsSlice,
    ui: uiSlice,
  },
});

export default store;
