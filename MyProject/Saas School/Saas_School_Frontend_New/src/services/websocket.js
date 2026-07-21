import { Client } from '@stomp/stompjs';
import { addNotification } from '@/utils/notifications/notificationsSlice';
import store from '@/utils/store/store';

let stompClient = null;
let connected = false;

export const connectWebSocket = (userId, schoolId) => {
  if (connected) {
    return;
  }

  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws', // Update with your actual WebSocket endpoint
    connectHeaders: {},
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  });

  stompClient.onConnect = function () {
    connected = true;
    console.log('WebSocket connected');
    
    // Subscribe to personal notifications
    stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
      const notification = JSON.parse(message.body);
      store.dispatch(addNotification(notification));
    });
    
    // Subscribe to school-wide notifications
    stompClient.subscribe(`/topic/school/${schoolId}/notifications`, (message) => {
      const notification = JSON.parse(message.body);
      store.dispatch(addNotification(notification));
    });
    
    // If user is a student, subscribe to class notifications
    const user = store.getState().auth.user;
    if (user === 'student') {
      const className = store.getState().student?.className;
      if (className) {
        stompClient.subscribe(`/topic/school/${schoolId}/class/${className}`, (message) => {
          const notification = JSON.parse(message.body);
          store.dispatch(addNotification(notification));
        });
      }
    }
  };

  stompClient.onStompError = function (frame) {
    console.error('STOMP error', frame);
    connected = false;
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    connected = false;
    console.log('WebSocket disconnected');
  }
};