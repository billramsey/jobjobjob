'use client';

import { useEffect, useState } from 'react';
import JobModal from '@/components/job-modal';
import JobRow from '@/components/job-row';
import { Database } from '@/types/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];

export default function ShowJobs() {
  const [jobs, setJobs] = useState([]);
  const [jobToEdit, setJobToEdit] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const getJobs = async () => {
    const response = await fetch('/api/jobs');
    setJobs(await response.json());
  };

  useEffect(() => {
    getJobs().catch((e) =>
      console.log(`failed to get jobs in show-jobs use-effect ${e}`),
    );
    return () => {};
  }, []);

  const openModalWithJobListing = (jobId: string) => {
    setJobToEdit(jobId);
    setModalOpen(true);
  };
  const causeRefresh = () => {
    getJobs().catch((e) => console.log(`failed to get jobs in show-jobs refresh ${e}`));
  };
  const deleteJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
    getJobs().catch((e) => console.log(`failed to get jobs in show-jobs delete ${e}`));
  };

  return (
    <>
      <div>
        <div>
          <button
            className="px-2 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setModalOpen(true)}
          >
            Add New Job
          </button>
          <JobModal
            isOpen={isModalOpen}
            closeModal={() => setModalOpen(false)}
            causeRefresh={() => causeRefresh()}
            jobId={jobToEdit}
          />
        </div>
        <div className="py-2">Jobs List</div>
        {jobs &&
          jobs.map((job: Job) => {
            return (
              <JobRow
                key={job.id}
                job={job}
                deleteAction={() => deleteJob(job.id.toString())}
                lookupAction={() => openModalWithJobListing(job.id.toString())}
              />
            );
          })}
      </div>
    </>
  );
}
