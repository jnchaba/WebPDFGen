import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import ProgressBar from './components/ProgressBar';
import DownloadSection from './components/DownloadSection';
import { ConversionJob, PDFOptions, ProgressUpdate } from './types';
import { apiService } from './services/api';
import { wsService } from './services/websocket';
import './App.css';

const App: React.FC = () => {
  const [currentJob, setCurrentJob] = useState<ConversionJob | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        await wsService.connect();
        setIsConnected(true);
        setError('');
        console.log('WebSocket connected successfully');
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setError('Failed to connect to server. Real-time updates may not work.');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Set up progress listener
    const handleProgress = (update: ProgressUpdate) => {
      if (currentJob && update.jobId === currentJob.id) {
        setCurrentJob(prev => prev ? {
          ...prev,
          progress: update.progress,
          status: update.status
        } : null);
        
        if (update.message) {
          setProgressMessage(update.message);
        }

        // If job is completed, fetch full job details
        if (update.status === 'completed') {
          fetchJobDetails(update.jobId);
        }
      }
    };

    wsService.on('progress', handleProgress);

    // Cleanup on unmount
    return () => {
      wsService.off('progress', handleProgress);
      wsService.disconnect();
    };
  }, [currentJob]);

  const fetchJobDetails = async (jobId: string) => {
    try {
      const job = await apiService.getJob(jobId);
      setCurrentJob(job);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      setError('Failed to fetch job details');
    }
  };

  const handleFileSelect = async (file: File, options?: PDFOptions) => {
    setError('');
    setProgressMessage('');
    
    try {
      const response = await apiService.convertFile(file, options);
      
      const newJob: ConversionJob = {
        id: response.jobId,
        filename: response.filename,
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
      };
      
      setCurrentJob(newJob);
      
      // Join the job room for WebSocket updates
      if (isConnected) {
        wsService.joinJob(response.jobId);
      } else {
        // Fallback: poll for updates if WebSocket is not connected
        pollJobStatus(response.jobId);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const job = await apiService.getJob(jobId);
        setCurrentJob(job);
        
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
        clearInterval(pollInterval);
      }
    }, 1000);
  };

  const handleReset = () => {
    if (currentJob && isConnected) {
      wsService.leaveJob(currentJob.id);
    }
    setCurrentJob(null);
    setProgressMessage('');
    setError('');
  };

  const getAppStatus = () => {
    if (error) return 'error';
    if (currentJob?.status === 'completed') return 'success';
    if (currentJob?.status === 'processing') return 'processing';
    if (currentJob?.status === 'failed') return 'error';
    return 'idle';
  };

  return (
    <div className={`app ${getAppStatus()}`}>
      <header className="app-header">
        <h1>HTML to PDF Converter</h1>
        <p>Convert your HTML files to PDF with real-time progress tracking</p>
        
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          <span className="status-text">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button 
              className="error-dismiss"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {currentJob?.status === 'completed' ? (
          <DownloadSection job={currentJob} onReset={handleReset} />
        ) : (
          <>
            <FileUploader
              onFileSelect={handleFileSelect}
              isUploading={!!currentJob && currentJob.status !== 'failed'}
              disabled={!!currentJob && currentJob.status !== 'failed'}
            />

            {currentJob && (
              <ProgressBar job={currentJob} message={progressMessage} />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, Express, and Puppeteer
        </p>
        <div className="footer-links">
          <span>Real-time progress updates via WebSocket</span>
          <span>•</span>
          <span>Configurable PDF options</span>
          <span>•</span>
          <span>Secure file handling</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
