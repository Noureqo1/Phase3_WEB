const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      socket.on('register', (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`Socket: user ${userId} joined their room`);
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    httpServer.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });

    // Increase timeout for large file uploads
    httpServer.setTimeout(300000); // 5 minutes
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
