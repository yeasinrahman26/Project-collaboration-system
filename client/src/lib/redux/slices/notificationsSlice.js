import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notification = state.list.find((n) => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    deleteNotification: (state, action) => {
      const notification = state.list.find((n) => n._id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount -= 1;
      }
      state.list = state.list.filter((n) => n._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  deleteNotification,
  setLoading,
  setError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
