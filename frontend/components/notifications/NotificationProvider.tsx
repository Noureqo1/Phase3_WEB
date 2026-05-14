'use client';
import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/app/providers/AuthProvider';

interface Toast {
  id: string;
  likerUsername: string;
  videoTitle: string;
}

interface NotificationContextValue {
  hasUnread: boolean;
  clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  hasUnread: false,
  clearUnread: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const clearUnread = useCallback(() => setHasUnread(false), []);

  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();
    socket.connect();
    socket.emit('register', user.id);

    socket.on('new-like', ({ likerUsername, videoTitle }: { likerUsername: string; videoTitle: string }) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, likerUsername, videoTitle }]);
      setHasUnread(true);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    });

    return () => {
      socket.off('new-like');
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ hasUnread, clearUnread }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 w-80 animate-slide-in-right flex items-start gap-3"
          >
            <div className="text-xl">❤️</div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {toast.likerUsername} liked your video
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                &quot;{toast.videoTitle}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
