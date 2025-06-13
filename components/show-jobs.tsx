'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/modal';

interface Job {
  id: number;
  company: string;
  listing_url: string;
}

export default function ShowJobs() {
  const [jobs, setJobs] = useState([]);

  const [listingUrl, setListingUrl] = useState('');
  const [title, setTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState<string | null>(null);
  const [salaryMax, setSalaryMax] = useState<string | null>(null);
  const [officePolicy, setOfficePolicy] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    const getJobs = async () => {
      const res = await fetch('/api/jobs/get');
      const n = await res.json();
      setJobs(n);
    };
    getJobs().catch((e) => console.log(e));
    return () => {};
  }, []);

  const lookupUrl = async (url: string) => {
    const res = await fetch(`/api/listingInfo/post`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    });

    const json = await res.json();
    if (json.error) {
      setLookupError(json.error.code);
    } else {
      setTitle(json.title);
      setSalaryMin(json.minSalary);
      setSalaryMax(json.maxSalary);
      setCompanyName(json.companyName);
      setOfficePolicy(json.officePolicy);
      setListingUrl(url);
    }
  };
  const submit = async () => {
    await fetch(`/api/application/post`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName,
        salaryMin,
        salaryMax,
        title,
        officePolicy,
        listingUrl
      }),
    }).catch((e)=> console.log(e));
  };

  return (
    <>
      <div>
        <div>
          <button
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setModalOpen(true)}
          >
            Add New Job
          </button>
          <Modal
            isOpen={isModalOpen}
            onSubmit={submit}
            submitText="Create New"
            closeModal={() => setModalOpen(false)}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900" id="dialog-title">
                    Enter Job Listing
                  </h3>
                  <div className="mt-2">
                    <div>
                      <div>
                        Listing URL: <input ref={inputRef} />
                      </div>
                      <div>
                        <button
                          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={() =>
                            inputRef.current?.value && lookupUrl(inputRef.current?.value)
                          }
                        >
                          Lookup
                        </button>
                      </div>
                    </div>
                    <div>
                      {lookupError && <div>{lookupError}</div>}
                      {listingUrl && (
                        <div>
                          <div>
                            Company Name:{' '}
                            <input
                              value={companyName || ''}
                              onChange={(e) => setCompanyName(e.target.value)}
                            />
                          </div>
                          <div>
                            Title:{' '}
                            <input
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            Office Policy:{' '}
                            <input
                              value={officePolicy || ''}
                              onChange={(e) => setOfficePolicy(e.target.value)}
                            />
                          </div>
                          <div>
                            Salary Min:{' '}
                            <input
                              value={salaryMin || ''}
                              onChange={(e) => setSalaryMin(e.target.value)}
                            />
                          </div>
                          <div>
                            Salary Max:{' '}
                            <input
                              value={salaryMax || ''}
                              onChange={(e) => setSalaryMax(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <div>Jobs List</div>
        </div>
        {jobs &&
          jobs.map((job: Job) => {
            return (
              <div key={job.id} className="grid grid-cols-4 gap-4">
                <div>{job.company}</div>

                <div>
                  <Link href={job.listing_url} rel="noopener noreferrer" target="_blank">
                    Listing Link
                  </Link>
                </div>
                <div>
                  <button
                    className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => lookupUrl(job.listing_url)}
                  >
                    Lookup
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
