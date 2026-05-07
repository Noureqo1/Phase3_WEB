// @ts-nocheck
const { io } = require('socket.io-client');

interface NotificationData {
  likerUsername?: string;
  commenterUsername?: string;
  videoTitle?: string;
  videoId?: string;
  amount?: number;
  message?: string;
  timestamp?: string;
}

interface VideoData {
  videoId: string;
  videoTitle: string;
  uploaderUsername: string;
  uploaderId: string;
  timestamp: string;
}

interface LikeUpdateData {
  videoId: string;
  action: string;
  userId: string;
  likes: number;
}

interface CommentUpdateData {
  videoId: string;
  commenterUsername: string;
  commentText: string;
  timestamp: string;
}

class SocketService {
  private socket: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server with socket ID:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected from server:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.disconnect();
      }
    });

    // Real-time notifications
    this.socket.on('new-like', (data: NotificationData) => {
      console.log('New like notification:', data);
      this.handleNotification('like', data);
    });

    this.socket.on('new-comment', (data: NotificationData) => {
      console.log('New comment notification:', data);
      this.handleNotification('comment', data);
    });

    this.socket.on('new-tip', (data: NotificationData) => {
      console.log('New tip notification:', data);
      this.handleNotification('tip', data);
    });

    this.socket.on('new-video', (data: VideoData) => {
      console.log('New video uploaded:', data);
      this.handleNewVideo(data);
    });

    this.socket.on('like-update', (data: LikeUpdateData) => {
      console.log('Like update:', data);
      this.handleLikeUpdate(data);
    });

    this.socket.on('comment-update', (data: CommentUpdateData) => {
      console.log('Comment update:', data);
      this.handleCommentUpdate(data);
    });
  }

  private handleNotification(type: string, data: NotificationData) {
    // Create custom event for notification components
    const event = new CustomEvent('notification', {
      detail: {
        type,
        data,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  }

  private handleNewVideo(data: VideoData) {
    // Create custom event for video feed updates
    const event = new CustomEvent('new-video', {
      detail: data
    });
    window.dispatchEvent(event);
  }

  private handleLikeUpdate(data: LikeUpdateData) {
    // Create custom event for like count updates
    const event = new CustomEvent('like-update', {
      detail: data
    });
    window.dispatchEvent(event);
  }

  private handleCommentUpdate(data: CommentUpdateData) {
    // Create custom event for comment updates
    const event = new CustomEvent('comment-update', {
      detail: data
    });
    window.dispatchEvent(event);
  }

  joinVideoRoom(videoId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-video-room', videoId);
    }
  }

  leaveVideoRoom(videoId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-video-room', videoId);
    }
  }

  likeVideo(data: { videoId: string; videoOwnerId: string; likerUsername: string; videoTitle: string }) {
    if (this.socket?.connected) {
      this.socket.emit('like-video', data);
    }
  }

  newComment(data: { videoId: string; videoOwnerId: string; commenterUsername: string; commentText: string; videoTitle: string }) {
    if (this.socket?.connected) {
      this.socket.emit('new-comment', data);
    }
  }

  videoUploaded(data: { videoId: string; videoTitle: string; uploaderUsername: string }) {
    if (this.socket?.connected) {
      this.socket.emit('video-uploaded', data);
    }
  }

  markNotificationRead(notificationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('mark-notification-read', notificationId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
