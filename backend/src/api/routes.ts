import { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs/promises';
import { upload, handleMulterError } from './middleware';
import { getPDFGenerator } from '../services/pdfGenerator';
import { jobManager } from '../services/jobManager';
import { PDFOptions } from '../types';

export const setupRoutes = (app: Express, io: Server): void => {
  const pdfGenerator = getPDFGenerator(io);

  // Upload and convert HTML file
  app.post('/api/convert', upload.single('htmlFile'), handleMulterError, async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload an HTML file'
        });
      }

      // Parse PDF options from request body
      let pdfOptions: PDFOptions = {};
      if (req.body.options) {
        try {
          pdfOptions = JSON.parse(req.body.options);
        } catch (error) {
          console.warn('Invalid PDF options provided, using defaults');
        }
      }

      // Create conversion job
      const job = jobManager.createJob(req.file.originalname);
      const outputFilename = `${path.parse(job.filename).name}-${job.id}.pdf`;
      const outputPath = path.join(__dirname, '../../outputs', outputFilename);

      // Update job with output path
      jobManager.updateJob(job.id, { 
        outputPath: outputFilename,
        status: 'processing'
      });

      // Start conversion in background
      pdfGenerator.convertHTMLFile(req.file.path, outputPath, job.id, pdfOptions)
        .then(() => {
          jobManager.updateJob(job.id, {
            status: 'completed',
            progress: 100,
            completedAt: new Date()
          });
          
          // Clean up uploaded file
          fs.unlink(req.file!.path).catch(console.error);
        })
        .catch((error) => {
          jobManager.updateJob(job.id, {
            status: 'failed',
            progress: 0,
            error: error.message
          });
          
          // Clean up uploaded file
          fs.unlink(req.file!.path).catch(console.error);
        });

      res.json({
        jobId: job.id,
        message: 'Conversion started',
        filename: job.filename
      });

    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({
        error: 'Conversion failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get job status
  app.get('/api/job/:jobId', (req: Request, res: Response) => {
    const { jobId } = req.params;
    const job = jobManager.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'The specified job does not exist'
      });
    }

    res.json(job);
  });

  // Get all jobs
  app.get('/api/jobs', (req: Request, res: Response) => {
    const jobs = jobManager.getAllJobs();
    res.json(jobs);
  });

  // Download converted PDF
  app.get('/api/download/:jobId', async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const { preview } = req.query;
      const job = jobManager.getJob(jobId);

      if (!job) {
        return res.status(404).json({
          error: 'Job not found',
          message: 'The specified job does not exist'
        });
      }

      if (job.status !== 'completed' || !job.outputPath) {
        return res.status(400).json({
          error: 'File not ready',
          message: 'PDF conversion is not completed yet'
        });
      }

      const filePath = path.join(__dirname, '../../outputs', job.outputPath);
      
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({
          error: 'File not found',
          message: 'The converted PDF file could not be found'
        });
      }

      // Set headers for file
      res.setHeader('Content-Type', 'application/pdf');
      
      // Set Content-Disposition based on whether it's a preview or download
      if (preview === 'true') {
        res.setHeader('Content-Disposition', `inline; filename="${job.outputPath}"`);
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${job.outputPath}"`);
      }
      
      // Send file
      res.sendFile(filePath);

    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({
        error: 'Download failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Convert HTML content directly (without file upload)
  app.post('/api/convert-content', async (req: Request, res: Response) => {
    try {
      const { htmlContent, filename, options } = req.body;

      if (!htmlContent) {
        return res.status(400).json({
          error: 'No HTML content provided',
          message: 'Please provide HTML content to convert'
        });
      }

      const displayFilename = filename || 'converted-document.html';
      const job = jobManager.createJob(displayFilename);
      const outputFilename = `${path.parse(displayFilename).name}-${job.id}.pdf`;
      const outputPath = path.join(__dirname, '../../outputs', outputFilename);

      // Update job with output path
      jobManager.updateJob(job.id, { 
        outputPath: outputFilename,
        status: 'processing'
      });

      // Start conversion in background
      pdfGenerator.generatePDF(htmlContent, outputPath, job.id, options || {})
        .then(() => {
          jobManager.updateJob(job.id, {
            status: 'completed',
            progress: 100,
            completedAt: new Date()
          });
        })
        .catch((error) => {
          jobManager.updateJob(job.id, {
            status: 'failed',
            progress: 0,
            error: error.message
          });
        });

      res.json({
        jobId: job.id,
        message: 'Conversion started',
        filename: displayFilename
      });

    } catch (error) {
      console.error('Content conversion error:', error);
      res.status(500).json({
        error: 'Conversion failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Define allowed example files
  const ALLOWED_EXAMPLES = [
    'simple-document.html',
    'complex-layout.html',
    'invoice-template.html'
  ];

  // Get example file content
  app.get('/api/example/:filename', async (req: Request, res: Response) => {
    try {
      const { filename } = req.params;
      
      // Check if filename is in allowed list
      if (!ALLOWED_EXAMPLES.includes(filename)) {
        return res.status(404).json({
          error: 'Example not found',
          message: 'The requested example file does not exist'
        });
      }

      const examplePath = path.join(__dirname, '../../../examples', filename);
      
      try {
        const htmlContent = await fs.readFile(examplePath, 'utf-8');
        
        res.json({
          filename,
          content: htmlContent
        });
      } catch (error) {
        return res.status(404).json({
          error: 'Example not found',
          message: 'The requested example file could not be read'
        });
      }

    } catch (error) {
      console.error('Example fetch error:', error);
      res.status(500).json({
        error: 'Failed to fetch example',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete job and associated files
  app.delete('/api/job/:jobId', async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = jobManager.getJob(jobId);

      if (!job) {
        return res.status(404).json({
          error: 'Job not found',
          message: 'The specified job does not exist'
        });
      }

      // Delete output file if it exists
      if (job.outputPath) {
        const filePath = path.join(__dirname, '../../outputs', job.outputPath);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`Could not delete output file: ${filePath}`);
        }
      }

      // Delete job from manager
      jobManager.deleteJob(jobId);

      res.json({
        message: 'Job deleted successfully'
      });

    } catch (error) {
      console.error('Job deletion error:', error);
      res.status(500).json({
        error: 'Deletion failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};