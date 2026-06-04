"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../redux/services/notificationsApi";
import {
  setNotifications,
  markAsRead,
  deleteNotification,
} from "../redux/slices/notificationsSlice";
import { useCallback, useEffect } from "react";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notificationsState = useSelector((state) => state.notifications);

  const { data: notificationsData, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 20 },
    { pollingInterval: 30000 }, // Poll every 30 seconds
  );

  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  // Update state when data changes
  useEffect(() => {
    if (notificationsData?.notifications) {
      dispatch(setNotifications(notificationsData.notifications));
    }
  }, [notificationsData, dispatch]);

  const markNotificationAsRead = useCallback(
    async (id) => {
      try {
        dispatch(markAsRead(id));
        await markAsReadMutation(id).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [markAsReadMutation, dispatch],
  );

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation().unwrap();
      // Re-fetch notifications after marking all as read
    } catch (error) {
      throw error;
    }
  }, [markAllAsReadMutation]);

  const deleteNotificationData = useCallback(
    async (id) => {
      try {
        dispatch(deleteNotification(id));
        await deleteNotificationMutation(id).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [deleteNotificationMutation, dispatch],
  );

  return {
    notifications: notificationsState.list,
    unreadCount: notificationsState.unreadCount,
    isLoading,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteNotificationData,
  };
};
