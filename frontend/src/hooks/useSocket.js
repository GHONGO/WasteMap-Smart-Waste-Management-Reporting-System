import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};
