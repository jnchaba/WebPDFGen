import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { PDFOptions, ConversionJob, ProgressUpdate } from '../types';
import { Server } from 'socket.io';

export class PDFGenerator {
  private browser: Browser | null = null;
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async initialize(): Promise<void> {
    if (!this.browser) {
      console.log('Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async shutdown(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private emitProgress(jobId: string, progress: number, status: ConversionJob['status'], message?: string): void {
    const update: ProgressUpdate = {
      jobId,
      progress,
      status,
      message
    };
    this.io.emit('progress', update);
  }

  async generatePDF(
    htmlContent: string,
    outputPath: string,
    jobId: string,
    options: PDFOptions = {}
  ): Promise<void> {
    await this.initialize();
    
    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    const page: Page = await this.browser.newPage();

    try {
      this.emitProgress(jobId, 10, 'processing', 'Creating new page...');

      // Set content
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      this.emitProgress(jobId, 30, 'processing', 'Loading HTML content...');

      // Wait for any dynamic content to load
      await page.waitForTimeout(1000);
      
      this.emitProgress(jobId, 50, 'processing', 'Rendering page...');

      // Configure PDF options
      const pdfOptions = {
        path: outputPath,
        format: options.format || 'A4',
        landscape: options.orientation === 'landscape',
        margin: options.margin || {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        },
        displayHeaderFooter: options.displayHeaderFooter || false,
        headerTemplate: options.headerTemplate || '',
        footerTemplate: options.footerTemplate || '',
        printBackground: options.printBackground !== false
      };

      this.emitProgress(jobId, 70, 'processing', 'Generating PDF...');

      // Generate PDF
      await page.pdf(pdfOptions as any);
      
      this.emitProgress(jobId, 90, 'processing', 'Finalizing PDF...');

      // Verify file was created
      try {
        await fs.access(outputPath);
        this.emitProgress(jobId, 100, 'completed', 'PDF generation completed!');
      } catch (error) {
        throw new Error('Failed to create PDF file');
      }

    } catch (error) {
      this.emitProgress(jobId, 0, 'failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      await page.close();
    }
  }

  async convertHTMLFile(
    htmlFilePath: string,
    outputPath: string,
    jobId: string,
    options: PDFOptions = {}
  ): Promise<void> {
    try {
      this.emitProgress(jobId, 5, 'processing', 'Reading HTML file...');
      
      const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');
      await this.generatePDF(htmlContent, outputPath, jobId, options);
    } catch (error) {
      this.emitProgress(jobId, 0, 'failed', `Error reading HTML file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}

// Singleton instance
let pdfGeneratorInstance: PDFGenerator | null = null;

export const getPDFGenerator = (io: Server): PDFGenerator => {
  if (!pdfGeneratorInstance) {
    pdfGeneratorInstance = new PDFGenerator(io);
  }
  return pdfGeneratorInstance;
};

// Cleanup on process exit
process.on('SIGINT', async () => {
  if (pdfGeneratorInstance) {
    await pdfGeneratorInstance.shutdown();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (pdfGeneratorInstance) {
    await pdfGeneratorInstance.shutdown();
  }
  process.exit(0);
});