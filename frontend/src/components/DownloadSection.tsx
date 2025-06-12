import React from 'react';
import { ConversionJob } from '../types';
import { apiService } from '../services/api';
import './DownloadSection.css';

interface DownloadSectionProps {
  job: ConversionJob | null;
  onReset: () => void;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ job, onReset }) => {
  if (!job || job.status !== 'completed' || !job.outputPath) {
    return null;
  }

  const handleDownload = async () => {
    try {
      const blob = await apiService.downloadPDF(job.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = job.outputPath || `${job.filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handlePreview = () => {
    const url = apiService.getDownloadUrl(job.id);
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeDuration = (): string => {
    if (!job.completedAt) return '';
    const start = new Date(job.createdAt).getTime();
    const end = new Date(job.completedAt).getTime();
    const duration = (end - start) / 1000;
    return `${duration.toFixed(1)}s`;
  };

  return (
    <div className="download-section">
      <div className="success-header">
        <div className="success-icon">🎉</div>
        <h2>Conversion Completed!</h2>
        <p>Your PDF has been generated successfully.</p>
      </div>

      <div className="file-info-card">
        <div className="file-icon">📄</div>
        <div className="file-details">
          <div className="file-name">{job.outputPath}</div>
          <div className="file-meta">
            <span className="conversion-time">Converted in {getTimeDuration()}</span>
            <span className="file-type">PDF Document</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="preview-button"
          onClick={handlePreview}
          title="Open PDF in new tab"
        >
          <span className="button-icon">👁️</span>
          Preview
        </button>
        
        <button
          className="download-button"
          onClick={handleDownload}
          title="Download PDF file"
        >
          <span className="button-icon">⬇️</span>
          Download PDF
        </button>
      </div>

      <div className="additional-actions">
        <button
          className="convert-another-button"
          onClick={onReset}
          title="Convert another file"
        >
          Convert Another File
        </button>
      </div>

      <div className="conversion-summary">
        <h3>Conversion Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span className="summary-label">Original File:</span>
            <span className="summary-value">{job.filename}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Started:</span>
            <span className="summary-value">
              {new Date(job.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Completed:</span>
            <span className="summary-value">
              {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Processing Time:</span>
            <span className="summary-value">{getTimeDuration()}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Job ID:</span>
            <span className="summary-value job-id">{job.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;