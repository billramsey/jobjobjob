import Link from 'next/link';

import { Database } from '@/types/database.types';

type JobRowTypes = {
  job: Job;
  lookupAction: (arg0: string) => void;
};

type Job = Database['public']['Tables']['jobs']['Row'];
export default function JobRow({ job, lookupAction }: JobRowTypes) {
  return (
    <div key={job.id} className="grid grid-cols-4 gap-4">
      <div>{job.company}</div>
      <div>
        {job.listing_url && (
          <Link href={job.listing_url} rel="noopener noreferrer" target="_blank">
            Listing Link
          </Link>
        )}
      </div>
      <div>{job.salary_min_dollars}</div>
      <div>{job.salary_max_dollars}</div>
      <div>
        <button
          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => lookupAction(job.listing_url || '')}
        >
          Lookup
        </button>
      </div>
    </div>
  );
}
