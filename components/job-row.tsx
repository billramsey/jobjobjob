'use client';

import Link from 'next/link';

import type { Database } from '@/types/database.types';

type JobRowTypes = {
  job: Job;
  lookupAction: (arg0: string) => void;
};

type Job = Database['public']['Tables']['jobs']['Row'];

export default function JobRow({ job, lookupAction }: JobRowTypes) {
  return (
    <div className="w-full my-2">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 py-1 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-100">
        <div className="font-medium text-gray-800">
          <span className="block text-xs text-gray-500 md:hidden">Company</span>
          {job.company}
        </div>

        <div className="col-span-1 md:col-span-2">
          <span className="block text-xs text-gray-500 md:hidden">Position</span>
          <span className="font-medium text-gray-800">{job.job_title}</span>
        </div>

        <div>
          <span className="block text-xs text-gray-500 md:hidden">Min Salary</span>
          {job.salary_min_dollars ? (
            <span className="text-green-600">
              ${job.salary_min_dollars.toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>

        <div>
          <span className="block text-xs text-gray-500 md:hidden">Max Salary</span>
          {job.salary_max_dollars ? (
            <span className="text-green-600">
              ${job.salary_max_dollars.toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>

        <div className="flex items-center">
          <span className="block text-xs text-gray-500 md:hidden">Listing</span>
          {job.listing_url ? (
            <Link
              href={job.listing_url}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Listing
            </Link>
          ) : (
            <span className="text-gray-400">No link</span>
          )}
        </div>

        <div className="flex justify-end px-2">
          <button
            className="px-2 py-1 text-xs font-medium text-center text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-300 transition-colors duration-200"
            onClick={() => lookupAction(job.listing_url || '')}
          >
            Lookup
          </button>
        </div>
      </div>
    </div>
  );
}
