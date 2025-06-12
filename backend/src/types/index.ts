export interface ConversionJob {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  outputPath?: string;
}

export interface PDFOptions {
  format?: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
}

export interface ConversionRequest {
  htmlContent: string;
  filename: string;
  options?: PDFOptions;
}

export interface ProgressUpdate {
  jobId: string;
  progress: number;
  status: ConversionJob['status'];
  message?: string;
}