import { useRef, useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  causeRefresh: () => void;
  submitText: string;
};

export default function JobModal({
  isOpen,
  closeModal,
  submitText,
  causeRefresh,
}: ModalProps) {
  const [listingUrl, setListingUrl] = useState('');
  const [title, setTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState<string | null>(null);
  const [salaryMax, setSalaryMax] = useState<string | null>(null);
  const [officePolicy, setOfficePolicy] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

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
        listingUrl,
      }),
    })
      .then(() => {
        setTitle('');
        setSalaryMin(null);
        setSalaryMax(null);
        setCompanyName('');
        setOfficePolicy('');
        setListingUrl('');
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
              Enter Job Listing
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

            {listingUrl && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    value={companyName || ''}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Policy
                  </label>
                  <input
                    value={officePolicy || ''}
                    onChange={(e) => setOfficePolicy(e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Min
                  </label>
                  <input
                    value={salaryMin || ''}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Max
                  </label>
                  <input
                    value={salaryMax || ''}
                    onChange={(e) => setSalaryMax(e.target.value)}
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
              {submitText}
            </button>
            <button
              type="button"
              onClick={closeModal}
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
