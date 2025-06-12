import React from 'react';
import { ConversionJob } from '../types';
import './ProgressBar.css';

interface ProgressBarProps {
  job: ConversionJob | null;
  message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ job, message }) => {
  if (!job) return null;

  const getStatusColor = (status: ConversionJob['status']) => {
    switch (status) {
      case 'pending':
        return '#6c757d';
      case 'processing':
        return '#007bff';
      case 'completed':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: ConversionJob['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚡';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusText = (status: ConversionJob['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-info">
          <span className="status-icon">{getStatusIcon(job.status)}</span>
          <span className="filename">{job.filename}</span>
          <span className="status-text" style={{ color: getStatusColor(job.status) }}>
            {getStatusText(job.status)}
          </span>
        </div>
        <div className="progress-percentage">
          {job.progress}%
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{
            width: `${job.progress}%`,
            backgroundColor: getStatusColor(job.status),
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {message && (
        <div className="progress-message">
          {message}
        </div>
      )}

      {job.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {job.error}
        </div>
      )}

      <div className="job-details">
        <small className="job-id">Job ID: {job.id}</small>
        <small className="job-time">
          Started: {new Date(job.createdAt).toLocaleTimeString()}
          {job.completedAt && (
            <> • Completed: {new Date(job.completedAt).toLocaleTimeString()}</>
          )}
        </small>
      </div>
    </div>
  );
};

export default ProgressBar;