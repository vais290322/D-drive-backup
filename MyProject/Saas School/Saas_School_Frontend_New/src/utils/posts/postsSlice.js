import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/api';
import axios from 'axios';
import postsUrlApi from "../../common/posts"

// In your fetchPosts thunk
export const fetchPosts = createAsyncThunk( 
  'posts/fetchPosts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // console.log('Fetching posts with filters:', filters);
      
      // Add a default schoolId if not provided in filters
      if (!filters.schoolId) {
        filters.schoolId = localStorage.getItem('schoolId') || 'default-school-id';
      }
      
      const response = await axios.get(`${postsUrlApi}/posts`, { params: filters });
      // console.log('Posts response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

// Async thunk for fetching a single post
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue,getState }) => {
    try {
      const state = getState();
      const schoolId = state.auth?.schoolId || localStorage.getItem('schoolId');
      
      const response = await axios.get(`${postsUrlApi}/posts/${postId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

// Async thunk for creating a post
export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      formData.append('audienceType', postData.audience.type);
      
      // Add a default user ID if needed
      formData.append('userId', 'default-user-id');
      
      if (postData.audience.classes && postData.audience.classes.length > 0) {
        formData.append('classes', JSON.stringify(postData.audience.classes));
      }
      
      if (postData.audience.sections && postData.audience.sections.length > 0) {
        formData.append('sections', JSON.stringify(postData.audience.sections));
      }
      
      if (postData.audience.students && postData.audience.students.length > 0) {
        formData.append('students', JSON.stringify(postData.audience.students));
      }
      
      if (postData.audience.teachers && postData.audience.teachers.length > 0) {
        formData.append('teachers', JSON.stringify(postData.audience.teachers));
      }
      
      if (postData.mediaFile) {
        formData.append('media', postData.mediaFile);
      }
      
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating post:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);


// Like a post
export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
     // console.log('Liking post with ID:', postId); // Add logging
      
      if (!postId) {
        throw new Error('Post ID is required');
      }
      
      const state = getState();
      const userId = state.auth?.userDetails?.id || 'default-user-id';
      const userName = state.auth?.userDetails?.studentName || state.auth?.userDetails?.teachersName || state.auth?.userDetails?.edpName || state.auth?.userDetails?.librarianName || state.auth?.userDetails?.userName || 'Admin';
      
      const response = await axios.post(`${postsUrlApi}/posts/${postId}/like`, {
        userId,
        userName
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error liking post:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

// Unlike a post
export const unlikePostAsync = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      //console.log('Unliking post with ID:', postId); // Add logging
      
      if (!postId) {
        throw new Error('Post ID is required');
      }
      
      const state = getState();
      const userId = state.auth?.userDetails?.id || 'default-user-id';
      
      const response = await axios.post(`${postsUrlApi}/posts/${postId}/unlike`, {
        userId
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error unliking post:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

// Add a comment to a post
export const addCommentAsync = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue, getState }) => {
    try {
      //console.log('Adding comment to post with ID:', postId); // Add logging
      
      if (!postId) {
        throw new Error('Post ID is required');
      }
      
      const state = getState();
      const userId = state.auth?.userDetails?.id || 'default-user-id';
      const userName = state.auth?.userDetails?.studentName || state.auth?.userDetails?.teachersName || state.auth?.userDetails?.edpName || state.auth?.userDetails?.librarianName || state.auth?.userDetails?.userName || 'Admin';
      
      
      const response = await axios.post(`${postsUrlApi}/posts/${postId}/comment`, {
        content,
        userId,
        userName
      });
      
      return {
        postId,
        comment: response.data.data
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

// Add this new thunk for fetching user's own posts
export const fetchMyPosts = createAsyncThunk( 
  'posts/fetchMyPosts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      //console.log('Fetching my posts with filters:', filters);
      
      // Add a default schoolId if not provided in filters
      if (!filters.schoolId) {
        filters.schoolId = localStorage.getItem('schoolId') || 'default-school-id';
      }
      
      // Make sure userId is included
      if (!filters.userId) {
        console.error('User ID is required for fetching my posts');
        return rejectWithValue('User ID is required');
      }
      
      const response = await axios.get(`${postsUrlApi}/posts/author`, { params: filters });
      console.log('My posts response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching my posts:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my posts');
    }
  }
);

// Save a post
export const savePostAsync = createAsyncThunk(
  'posts/savePost',
  async ({ postId, userId, schoolId }, { rejectWithValue }) => {
    try {
      //console.log('Saving post with ID:', postId);
      
      if (!postId || !userId || !schoolId) {
        throw new Error('Post ID, User ID, and School ID are required');
      }
      
      const response = await axios.post(`${postsUrlApi}/posts/${postId}/save`, {
        userId,
        schoolId
      });
      
      return response.data.data; // This will be the updated savedPostIds array
    } catch (error) {
      console.error('Error saving post:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to save post');
    }
  }
);

// Unsave a post
export const unsavePostAsync = createAsyncThunk(
  'posts/unsavePost',
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      // console.log('Unsaving post with ID:', postId);
      
      if (!postId || !userId) {
        throw new Error('Post ID and User ID are required');
      }
      
      const response = await axios.post(`${postsUrlApi}/posts/${postId}/unsave`, {
        userId
      });
      
      return response.data.data; // This will be the updated savedPostIds array
    } catch (error) {
      console.error('Error unsaving post:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to unsave post');
    }
  }
);

// Fetch saved posts
export const fetchSavedPosts = createAsyncThunk(
  'posts/fetchSavedPosts',
  async ({ userId, schoolId }, { rejectWithValue }) => {
    try {
      // console.log('Fetching saved posts for user:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const params = { userId };
      if (schoolId) params.schoolId = schoolId;
      
      const response = await axios.get(`${postsUrlApi}/posts/saved`, { params });
      console.log('Saved posts response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved posts');
    }
  }
);

// Fetch saved post IDs
export const fetchSavedPostIds = createAsyncThunk(
  'posts/fetchSavedPostIds',
  async (userId, { rejectWithValue }) => {
    try {
      // console.log('Fetching saved post IDs for user:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const response = await axios.get(`${postsUrlApi}/posts/saved/ids`, { params: { userId } });
      console.log('Saved post IDs response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching saved post IDs:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved post IDs');
    }
  }
);

// Add this new thunk for fetching all posts from a school
export const fetchAllSchoolPosts = createAsyncThunk( 
  'posts/fetchAllSchoolPosts',
  async (schoolId, { rejectWithValue }) => {
    try {
      // console.log('Fetching all posts for school:', schoolId);
      
      if (!schoolId) {
        console.error('School ID is required for fetching school posts');
        return rejectWithValue('School ID is required');
      }
      
      const response = await axios.get(`${postsUrlApi}/posts/school`, { params: { schoolId } });
      console.log('School posts response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching school posts:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch school posts');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    savedPostIds: [], // Add this to track saved post IDs
    isLoading: false,
    error: null
  },
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.currentPost = null;
    },
    // Add setCurrentPost reducer
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setSavedPostIds: (state, action) => {
      state.savedPostIds = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single post
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create post
      .addCase(createPostAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Like post
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      
      // Unlike post
      .addCase(unlikePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      
      // Add comment
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const index = state.posts.findIndex(post => post._id === postId);
        if (index !== -1) {
          state.posts[index].comments.push(comment);
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.comments.push(comment);
        }
      })

      .addCase(fetchMyPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })

      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(savePostAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(savePostAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedPostIds = action.payload;
      })
      .addCase(savePostAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Unsave post
      .addCase(unsavePostAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unsavePostAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedPostIds = action.payload;
      })
      .addCase(unsavePostAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch saved posts
      .addCase(fetchSavedPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch saved post IDs
      .addCase(fetchSavedPostIds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedPostIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedPostIds = action.payload;
      })
      .addCase(fetchSavedPostIds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSchoolPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSchoolPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllSchoolPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch school posts';
      });
  }
});


// Update the exports to include setCurrentPost
export const { clearPosts, setCurrentPost, setSavedPostIds } = postsSlice.actions;
export default postsSlice.reducer;

// Export createPostAsync as addPost for backward compatibility
export const addPost = createPostAsync;

// Export addCommentAsync as addComment for backward compatibility
export const addComment = addCommentAsync;

// Export a toggleLike function that will handle both like and unlike operations
export const toggleLike = (postId, isLiked) => {
  return isLiked ? unlikePostAsync(postId) : likePostAsync(postId);
};

export const toggleSave = (postId, isSaved, userId, schoolId) => {
  return isSaved 
    ? unsavePostAsync({ postId, userId }) 
    : savePostAsync({ postId, userId, schoolId });
};