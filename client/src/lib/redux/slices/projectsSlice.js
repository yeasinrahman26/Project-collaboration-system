import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentProject: null,
  isLoading: false,
  error: null,
  filters: {
    status: "",
    sort: "createdAt",
    page: 1,
    search: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.list = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.currentProject = null;
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
    addProject: (state, action) => {
      state.list.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.list.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProjects,
  setCurrentProject,
  clearSelectedProject,
  setLoading,
  setError,
  setFilters,
  setPagination,
  addProject,
  updateProject,
  deleteProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;
