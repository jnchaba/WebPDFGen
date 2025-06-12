import { ConversionJob } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class JobManager {
  private jobs: Map<string, ConversionJob> = new Map();

  createJob(filename: string): ConversionJob {
    const job: ConversionJob = {
      id: uuidv4(),
      filename,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    this.jobs.set(job.id, job);
    return job;
  }

  getJob(jobId: string): ConversionJob | undefined {
    return this.jobs.get(jobId);
  }

  updateJob(jobId: string, updates: Partial<ConversionJob>): ConversionJob | null {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    const updatedJob = { ...job, ...updates };
    this.jobs.set(jobId, updatedJob);
    return updatedJob;
  }

  getAllJobs(): ConversionJob[] {
    return Array.from(this.jobs.values());
  }

  deleteJob(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  // Cleanup old jobs (older than 1 hour)
  cleanupOldJobs(): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    let deletedCount = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt < oneHourAgo) {
        this.jobs.delete(jobId);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Singleton instance
export const jobManager = new JobManager();

// Schedule cleanup every 30 minutes
setInterval(() => {
  const deletedCount = jobManager.cleanupOldJobs();
  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} old jobs`);
  }
}, 30 * 60 * 1000);