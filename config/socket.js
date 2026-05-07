const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected with role ${socket.userRole}`);
    
    // Join user to their personal room
    socket.join(socket.userId);
    console.log(`User ${socket.userId} joined their personal room`);

    // Handle joining video-specific rooms
    socket.on('join-video-room', (videoId) => {
      socket.join(`video-${videoId}`);
      console.log(`User ${socket.userId} joined video room: ${videoId}`);
    });

    // Handle leaving video-specific rooms
    socket.on('leave-video-room', (videoId) => {
      socket.leave(`video-${videoId}`);
      console.log(`User ${socket.userId} left video room: ${videoId}`);
    });

    // Handle real-time likes
    socket.on('like-video', async (data) => {
      try {
        const { videoId, videoOwnerId, likerUsername, videoTitle } = data;
        
        // Emit to video owner's personal room
        io.to(videoOwnerId).emit('new-like', {
          likerUsername,
          videoTitle,
          videoId,
          timestamp: new Date().toISOString()
        });

        // Emit to video room for real-time updates
        io.to(`video-${videoId}`).emit('like-update', {
          videoId,
          action: 'liked',
          userId: socket.userId
        });

        console.log(`Like notification sent to user ${videoOwnerId} for video ${videoId}`);
      } catch (error) {
        console.error('Error handling like event:', error);
      }
    });

    // Handle real-time comments
    socket.on('new-comment', async (data) => {
      try {
        const { videoId, videoOwnerId, commenterUsername, commentText } = data;
        
        // Emit to video owner's personal room
        io.to(videoOwnerId).emit('new-comment', {
          commenterUsername,
          commentText,
          videoTitle: data.videoTitle,
          videoId,
          timestamp: new Date().toISOString()
        });

        // Emit to video room for real-time updates
        io.to(`video-${videoId}`).emit('comment-update', {
          videoId,
          commenterUsername,
          commentText,
          timestamp: new Date().toISOString()
        });

        console.log(`Comment notification sent to user ${videoOwnerId} for video ${videoId}`);
      } catch (error) {
        console.error('Error handling comment event:', error);
      }
    });

    // Handle new video uploads
    socket.on('video-uploaded', async (data) => {
      try {
        const { videoId, videoTitle, uploaderUsername } = data;
        
        // Emit to all users for real-time feed updates
        io.emit('new-video', {
          videoId,
          videoTitle,
          uploaderUsername,
          timestamp: new Date().toISOString()
        });

        console.log(`New video broadcast: ${videoTitle} by ${uploaderUsername}`);
      } catch (error) {
        console.error('Error handling video upload event:', error);
      }
    });

    // Handle user notifications
    socket.on('mark-notification-read', (notificationId) => {
      // This would typically update the database
      socket.emit('notification-read', notificationId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
