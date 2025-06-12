"use client"

import {useEffect, useState} from "react";

interface Job {
  id: number,
  company: string,
  listing_url: string,
}

export default function ShowJobs() {
  const [jobs, setJobs] = useState([]);

  const [listingUrl, setListingUrl] = useState('');
  const [title, setTitle] = useState('');
  const [salaryMin, setSalaryMin] = useState<string | null>(null)
  const [salaryMax, setSalaryMax] = useState<string | null>(null)

  useEffect(() => {
    const getJobs = async () => {
      const res = await fetch("/api/jobs/get");
      const n = await res.json();
      setJobs(n);
    }
    getJobs()

    return ()=> {};
  }, [])

  const lookupUrl = async (url: string) => {

    const res = await fetch(`/api/listingInfo/post`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: url})
    });
    const json = await res.json();
    setTitle(json.title);
    setSalaryMin(json.minSalary);
    setSalaryMax(json.minSalary);
    setListingUrl(url)
  }

  return (
    <>
    <div>
      <div>Jobs List</div>
      {
        jobs && jobs.map((job: Job) => {
          return (
            <div key={job.id}>
              <div>{job.company}</div>
              <div onClick={() => lookupUrl(job.listing_url)}>{job.listing_url}</div>
            </div>
          )
        })
      }
    </div>
    <div>
      {listingUrl && (
        <div>
          <div>
            Title: <input value={title} onChange={e => setTitle(e.target.value)}/>
          </div>
          <div>
            Salary Min: <input value={salaryMin || ''} onChange={e => setSalaryMin(e.target.value)}/>
          </div>
          <div>
            Salary Max: <input value={salaryMax || ''} onChange={e => setSalaryMax(e.target.value)}/>
          </div>
        </div>
      )
      }
    </div>
    </>
  )
}