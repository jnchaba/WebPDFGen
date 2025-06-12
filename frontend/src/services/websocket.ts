import { io, Socket } from 'socket.io-client';
import { ProgressUpdate } from '../types';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: { [event: string]: Function[] } = {};

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(WS_URL, {
          transports: ['websocket', 'polling'],
          timeout: 5000,
        });

        this.socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
        });

        this.socket.on('connected', (data) => {
          console.log('Server acknowledgment:', data);
        });

        // Handle progress updates
        this.socket.on('progress', (update: ProgressUpdate) => {
          this.emit('progress', update);
        });

        // Handle job updates
        this.socket.on('job-update', (update: ProgressUpdate) => {
          this.emit('job-update', update);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners = {};
  }

  joinJob(jobId: string): void {
    if (this.socket) {
      this.socket.emit('join-job', jobId);
    }
  }

  leaveJob(jobId: string): void {
    if (this.socket) {
      this.socket.emit('leave-job', jobId);
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      delete this.listeners[event];
      return;
    }

    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();