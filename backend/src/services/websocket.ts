import { Server, Socket } from 'socket.io';
import { ProgressUpdate } from '../types';

export const setupWebSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a specific job room for targeted updates
    socket.on('join-job', (jobId: string) => {
      socket.join(`job-${jobId}`);
      console.log(`Client ${socket.id} joined job room: job-${jobId}`);
    });

    // Leave a job room
    socket.on('leave-job', (jobId: string) => {
      socket.leave(`job-${jobId}`);
      console.log(`Client ${socket.id} left job room: job-${jobId}`);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Send initial connection confirmation
    socket.emit('connected', {
      message: 'Connected to HTML to PDF converter',
      timestamp: new Date().toISOString()
    });
  });

  // Global progress update function
  io.emitProgress = (update: ProgressUpdate) => {
    // Emit to specific job room
    io.to(`job-${update.jobId}`).emit('progress', update);
    
    // Also emit to all connected clients for general updates
    io.emit('job-update', update);
    
    console.log(`Progress update for job ${update.jobId}: ${update.progress}% - ${update.status}`);
  };
};

// Extend the Server interface to include our custom method
declare module 'socket.io' {
  interface Server {
    emitProgress(update: ProgressUpdate): void;
  }
}