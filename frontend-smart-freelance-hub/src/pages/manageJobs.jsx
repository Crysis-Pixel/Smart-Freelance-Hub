import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: [],
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const navigate = useNavigate();

  const availableSkills = [
    "Web-Development",
    "Video-Editor",
    "Photo-Editor",
    "UI/UX Design",
    "Graphics Designer",
    "Data Analyst",
    "Application Developer",
    "SEO analyst",
  ];

  // commented out cuz the page wont load without the backend part

  //   // Fetch jobs from the server
  //   useEffect(() => {
  //     const fetchJobs = async () => {
  //       try {
  //         const response = await fetch(
  //           "http://localhost:3000/jobs/getClientJobs",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               clientEmail: JSON.parse(sessionStorage.getItem("user")).email,
  //             }),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch jobs");
  //         }

  //         const jobsData = await response.json();
  //         setJobs(jobsData);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchJobs();
  //   }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(selectedSkill)
        ? prevSkills
        : [...prevSkills, selectedSkill]
    );
  };

  const handlePostJob = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs/postJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newJob,
          requirements: selectedSkills,
          clientEmail: JSON.parse(sessionStorage.getItem("user")).email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const postedJob = await response.json();
      setJobs([...jobs, postedJob]); // Add the newly posted job to the jobs list
      setIsModalOpen(false); // Close the modal
      setNewJob({ title: "", description: "", requirements: [] });
      setSelectedSkills([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch("http://localhost:3000/jobs/deleteJob", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError(err.message);
    }
  };

  //remvoe comment after adding backend functionality

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto my-10 p-5 flex-grow">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Manage Jobs</h1>
            <button className="btn btn-primary" onClick={handleModalToggle}>
              Post New Job
            </button>
          </div>

          <div className="grid gap-5">
            {jobs.length === 0 ? (
              <p className="text-gray-600 text-center">
                You currently have no jobs posted. Click "Post New Job" to
                create one and find freelancers!
              </p>
            ) : (
              jobs.map((job, index) => (
                <div key={index} className="border p-5 rounded-md shadow-sm">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-gray-500">
                    Requirements: {job.requirements.join(", ")}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/edit-job/${job.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/contact-freelancer/${job.id}`)}
                    >
                      Contact Freelancer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />

        {/* Post New Job Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 w-1/2">
              <h2 className="text-2xl font-semibold mb-5">Post New Job</h2>

              <label className="block mb-3">
                <span className="text-gray-700">Job Title</span>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mt-2"
                  placeholder="Enter job title"
                />
              </label>

              <label className="block mb-3">
                <span className="text-gray-700">Description</span>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full mt-2"
                  placeholder="Enter job description"
                />
              </label>

              <label className="block mb-3">
                <span className="text-gray-700">Requirements</span>
                <select
                  onChange={handleSkillSelect}
                  className="select select-bordered w-full mt-2"
                  value=""
                >
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {availableSkills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap mt-2">
                  {selectedSkills.map((skill, index) => (
                    <span key={index} className="badge badge-primary m-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </label>

              <div className="flex justify-end mt-5">
                <button
                  className="btn btn-secondary mr-3"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handlePostJob}>
                  Post Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
