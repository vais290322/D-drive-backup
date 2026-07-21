import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../common/api';

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.userDetails?.id;
      const schoolId = state.auth?.schoolId || state.auth?.userDetails?.schoolId;
      const userRole = state.auth?.user; 
      
      if (!userId) {
        return rejectWithValue('User ID is required');
      }
      
      const response = await api.get('/notifications', {
        params: { userId, schoolId, userRole }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

// Async thunk for marking a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.userDetails?.id;
      
      const response = await api.put(`/notifications/${notificationId}/read`, {}, {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// Async thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.userDetails?.id;
      const schoolId = state.auth?.schoolId || state.auth?.userDetails?.schoolId;
      
      await api.put('/notifications/mark-all-read', {}, {
        params: { userId, schoolId }
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

// Async thunk for deleting a notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.userDetails?.id;
      
      await api.delete(`/notifications/${notificationId}`, {
        params: { userId }
      });
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

// Async thunk for deleting all notifications
export const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAllNotifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.userDetails?.id;
      const schoolId = state.auth?.schoolId || state.auth?.userDetails?.schoolId;
      
      await api.delete('/notifications', {
        params: { userId, schoolId }
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete all notifications');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(notification => !notification.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          const wasUnread = !state.notifications[index].read;
          state.notifications[index] = action.payload;
          if (wasUnread && action.payload.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      })
      
      // Delete all notifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  
  }
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;