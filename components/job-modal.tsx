import { useEffect, useRef, useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  causeRefresh: () => void;
  jobId: string;
};

// Not sure if I want to use the supabase definition, as that could change on every update of types.
// so I'm going to copy them here.  If in the future, this is a pain, we could also just pick and choose
// out of the DatabaseRow.  I'm also going to go with snake_case, converting feels wrong, and this will
// point readers to the fact that this info is going in and out of the database.
// we'll also set office_policy to a string and adjust later
type ReactJob = {
  company: string;
  id: number | null;
  job_title: string | null;
  listing_url: string | null;
  office_policy: string | null;
  salary_max_dollars: number | null;
  salary_min_dollars: number | null;
};
const emptyJob = {
  company: '',
  id: null,
  job_title: null,
  listing_url: null,
  office_policy: null,
  salary_max_dollars: null,
  salary_min_dollars: null,
};

export default function JobModal({
  isOpen,
  closeModal,
  causeRefresh,
  jobId,
}: ModalProps) {
  const [job, setJob] = useState<ReactJob>(emptyJob);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const closeAndClean = () => {
    setJob(emptyJob);
    setLookupError(null);
    closeModal();
  };
  const updateJobValue = (key: string, value: string | number | null) => {
    setJob((previousJob: ReactJob) => ({
      ...previousJob,
      [key]: value,
    }));
  };

  useEffect(() => {
    const getJob = async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      const n = await res.json();
      setJob(n);
    };
    if (jobId) {
      getJob().catch((e) => console.log(`failed to get jobs in modal ${e}`));
    }
    return () => {};
  }, [jobId]);

  const lookupUrl = async (url: string) => {
    const res = await fetch(`/api/listingInfo`, {
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
      setJob({
        id: job.id,
        job_title: json.title,
        salary_min_dollars: json.minSalary,
        salary_max_dollars: json.maxSalary,
        company: json.companyName,
        listing_url: url,
        office_policy: json.officePolicy,
      });
    }
  };

  const submit = async () => {
    let url = '/api/jobs';
    let method = 'POST';
    if (job.id) {
      url = `/api/jobs/${jobId}`;
      method = 'PUT';
    }
    await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    })
      .then(() => {
        setJob(emptyJob);
        causeRefresh();
        closeModal();
      })
      .catch((e) => console.log(e));
  };

  return !isOpen ? (
    <></>
  ) : (
    <div className="relative z-10">
      <div className="fixed inset-y-0 right-0 z-20 w-1/3 bg-gray-100 shadow-xl transition-transform transform">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {jobId ? 'Edit' : 'Enter'} Job Listing
            </h3>

            <div className="mb-4">
              <label
                htmlFor="listing-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Listing URL
              </label>
              <div className="flex space-x-3">
                <input
                  id="listing-url"
                  ref={inputRef}
                  defaultValue={job.listing_url || ''}
                  placeholder="https://example.com/listing"
                  className="flex-grow block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  className="px-5 py-3 text-sm font-medium text-center text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  onClick={() =>
                    inputRef.current?.value && lookupUrl(inputRef.current?.value)
                  }
                >
                  Lookup
                </button>
              </div>
            </div>

            {lookupError && (
              <div className="text-red-600 text-sm font-medium">{lookupError}</div>
            )}
            {job.listing_url && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    value={job.company || ''}
                    onChange={(e) => updateJobValue('company', e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    value={job.job_title || ''}
                    onChange={(e) => updateJobValue('job_title', e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Policy
                  </label>
                  <input
                    value={job.office_policy || ''}
                    onChange={(e) => updateJobValue('office_policy', e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Min
                  </label>
                  <input
                    value={job.salary_min_dollars || ''}
                    onChange={(e) => updateJobValue('salary_min_dollars', e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Max
                  </label>
                  <input
                    value={job.salary_max_dollars || ''}
                    onChange={(e) => updateJobValue('salary_max_dollars', e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 flex justify-end">
            <button
              type="button"
              onClick={submit}
              className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              {jobId ? 'Update' : 'Create New'}
            </button>
            <button
              type="button"
              onClick={closeAndClean}
              className="ml-3 inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
