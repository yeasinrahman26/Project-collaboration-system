import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: "",
    priority: "",
    projectId: "",
    assignedTo: "",
    sort: "createdAt",
    page: 1,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  kanbanData: {
    todo: [],
    inProgress: [],
    completed: [],
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.list = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    setKanbanData: (state, action) => {
      state.kanbanData = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addTask: (state, action) => {
      state.list.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.list.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((t) => t._id !== action.payload);
    },
  },
});

export const {
  setTasks,
  setCurrentTask,
  setKanbanData,
  setLoading,
  setError,
  setFilters,
  setPagination,
  addTask,
  updateTask,
  deleteTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
