import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}
