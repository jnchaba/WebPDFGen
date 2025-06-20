import axios from 'axios';
import { ConversionJob, PDFOptions, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

export const apiService = {
  // Upload and convert HTML file
  convertFile: async (file: File, options?: PDFOptions): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('htmlFile', file);
    
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Convert HTML content directly
  convertContent: async (htmlContent: string, filename: string, options?: PDFOptions): Promise<ApiResponse> => {
    const response = await api.post('/convert-content', {
      htmlContent,
      filename,
      options,
    });

    return response.data;
  },

  // Get job status
  getJob: async (jobId: string): Promise<ConversionJob> => {
    const response = await api.get(`/job/${jobId}`);
    return response.data;
  },

  // Get all jobs
  getAllJobs: async (): Promise<ConversionJob[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Download PDF
  downloadPDF: async (jobId: string): Promise<Blob> => {
    const response = await api.get(`/download/${jobId}`, {
      responseType: 'blob',
    });

    return response.data;
  },

  // Delete job
  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/job/${jobId}`);
  },

  // Get download URL
  getDownloadUrl: (jobId: string): string => {
    return `${API_BASE_URL}/download/${jobId}`;
  },

  // Get preview URL
  getPreviewUrl: (jobId: string): string => {
    return `${API_BASE_URL}/download/${jobId}?preview=true`;
  },

  // Get example file content
  getExample: async (filename: string): Promise<{ filename: string; content: string }> => {
    const response = await api.get(`/example/${filename}`);
    return response.data;
  },
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);