export const selectBlogById = (id) => (state) =>
    state.blogs.blogs.find((b) => b.id === id) ||
    state.blogs.sidebarBlogs.find((b) => b.id === id) ||
    (state.blogs.selectedBlog?.id === id ? state.blogs.selectedBlog : null);
  