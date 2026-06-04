"use client";

import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal, closeAllModals } from "../redux/slices/uiSlice";
import { useCallback } from "react";

export const useModal = (modalName) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modals[modalName]);

  const open = useCallback(() => {
    dispatch(openModal(modalName));
  }, [dispatch, modalName]);

  const close = useCallback(() => {
    dispatch(closeModal(modalName));
  }, [dispatch, modalName]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
