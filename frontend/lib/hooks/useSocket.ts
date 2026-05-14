'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

/**
 * React hook that wraps the getSocket() singleton.
 * Provides connection status for components that need it.
 *
 * @returns {{ isConnected: boolean }} Socket connection state
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Initial check
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected };
}
