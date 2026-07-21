import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  fetchPopularBlogs,
  editBlog,
  searchSidebarBlogs,
} from "./blogsAsyncThunk";
import { STATUS } from "@/V2/config";

const initialState = {
  blogs: [],
  sidebarBlogs: [],
  selectedBlog: null,
  status: {
    fetch: STATUS.IDLE,
    sidebar: STATUS.IDLE,
    create: STATUS.IDLE,
    update: STATUS.IDLE,
  },
  error: {
    fetch: null,
    sidebar: null,
    create: null,
    update: null,
  },
};

export const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    selectBlog(state, action) {
      const id = action.payload;
      state.selectedBlog =
        state.blogs.find((blog) => blog.id === id) ||
        state.sidebarBlogs.find((blog) => blog.id === id) ||
        null;
    },
    trimBlogs: (state, action) => {
      const count = action.payload;
      state.blogs = state.blogs.slice(0, count);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status.fetch = STATUS.LOADING;
        state.error.fetch = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status.fetch = STATUS.SUCCEEDED;

        if (action.meta.arg?.append) {
          state.blogs = [...state.blogs, ...action.payload.content];
        } else {
          state.blogs = action.payload.content;
        }
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status.fetch = STATUS.FAILED;
        state.error.fetch = action.payload;
      })
      .addCase(fetchPopularBlogs.pending, (state) => {
        state.status.sidebar = STATUS.LOADING;
        state.error.sidebar = null;
      })
      .addCase(fetchPopularBlogs.fulfilled, (state, action) => {
        state.status.sidebar = STATUS.SUCCEEDED;
        state.sidebarBlogs = action.payload;
      })
      .addCase(fetchPopularBlogs.rejected, (state, action) => {
        state.status.sidebar = STATUS.FAILED;
        state.error.sidebar = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.status.fetch = STATUS.LOADING;
        state.error.fetch = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status.fetch = STATUS.SUCCEEDED;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status.fetch = STATUS.FAILED;
        state.error.fetch = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.status.create = STATUS.LOADING;
        state.error.create = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.status.create = STATUS.SUCCEEDED;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status.create = STATUS.FAILED;
        state.error.create = action.payload;
      })
      .addCase(editBlog.pending, (state) => {
        state.status.update = STATUS.LOADING;
        state.error.update = null;
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.status.update = STATUS.SUCCEEDED;
        const updated = action.payload;
        const index = state.blogs.findIndex((b) => b.id === updated.id);
        if (index !== -1) state.blogs[index] = updated;
        const sidebarIndex = state.sidebarBlogs.findIndex(
          (b) => b.id === updated.id
        );
        if (sidebarIndex !== -1) state.sidebarBlogs[sidebarIndex] = updated;
        if (state.selectedBlog?.id === updated.id) state.selectedBlog = updated;
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.status.update = STATUS.FAILED;
        state.error.update = action.payload;
      })
      .addCase(searchSidebarBlogs.pending,  (state) => {
        state.status.sidebar = STATUS.LOADING;
        state.error.sidebar = null;
      })
      .addCase(searchSidebarBlogs.fulfilled, (state, action) => {
        state.status.sidebar = STATUS.SUCCEEDED;
        state.sidebarBlogs = action.payload;
      })
      .addCase(searchSidebarBlogs.rejected, (state, action) => {
        state.status.sidebar = STATUS.FAILED;
        state.error.sidebar = action.payload;
      })
  },
});

export default blogsSlice.reducer;
export const blogsAction = blogsSlice.actions;
