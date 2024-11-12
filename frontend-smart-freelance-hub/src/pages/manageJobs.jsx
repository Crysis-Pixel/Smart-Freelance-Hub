import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import GigContainerModal from "../components/GigContainerModal";
import AddOtherSkill from "../components/AddOtherSkill";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: [],
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [isOtherSkillModalOpen, setIsOtherSkillModalOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
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
    "Other",
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/jobs/getJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientEmail: JSON.parse(sessionStorage.getItem("user")).email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const jobsData = await response.json();
        const sortedJobs = jobsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setJobs(sortedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;

    if (selectedSkill === "Other") {
      setIsOtherSkillModalOpen(true); // Open the modal when "Other" is selected
    } else {
      if (!selectedSkills.includes(selectedSkill)) {
        setSelectedSkills((prevSkills) => [...prevSkills, selectedSkill]);
      }
    }
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
          requirements: selectedSkills.join(", "),
          clientEmail: JSON.parse(sessionStorage.getItem("user")).email,
        }),
      });

      if (response.status !== 200) {
        throw new Error("Failed to post job");
      }

      const postedJob = await response.json();
      setJobs((prevJobs) => [postedJob, ...prevJobs]);
      setIsModalOpen(false);
      setNewJob({ title: "", description: "", requirements: [] });
      setSelectedSkills([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch("http://localhost:3000/jobs/cancelJob", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete job: ${response.statusText}`);
      }

      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      setError(err.message);
    }
  };

  const handleFindFreelancers = async (job) => {
    try {
      const response = await fetch("http://127.0.0.1:8000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requirements: job.requirements.join(", ") }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch freelancers");
      }

      const freelancersData = await response.json();
      setFreelancers(freelancersData);
      setIsGigModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      setSelectedSkills((prevSkills) => [...prevSkills, customSkill.trim()]);
      setCustomSkill("");
      setIsOtherSkillModalOpen(false);
    } else {
      alert("Please enter a valid custom skill.");
    }
  };

  return (
    <>
      <Header
        profilePicture={
          JSON.parse(sessionStorage.getItem("user")).profilePicture
        }
      />
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
                  <p>Skill Requirements:</p>
                  <div className="flex flex-wrap gap-2 w-96">
                    {job.requirements.map((requirement, index) => (
                      <span
                        key={index}
                        className="badge badge-primary bg-blue-100 border-none"
                      >
                        {requirement}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/edit-job/${job.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                    <button className="btn btn-success" onClick={toggleChat}>
                      Contact Freelancer
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleFindFreelancers(job)}
                    >
                      Find Freelancer
                    </button>
                    <ChatBox isOpen={isChatOpen} onClose={toggleChat} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />

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
                  {availableSkills
                    .filter((skill) => !selectedSkills.includes(skill))
                    .map((skill, index) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ))}
                </select>
                <div className="flex flex-wrap mt-2">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge badge-primary m-1 bg-blue-100 border-none"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        &#x2715;
                      </button>
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

        <AddOtherSkill
          isOpen={isOtherSkillModalOpen}
          onClose={() => setIsOtherSkillModalOpen(false)}
          onSubmit={handleAddCustomSkill}
          skill={customSkill}
          setSkill={setCustomSkill}
        />

        <GigContainerModal
          isOpen={isGigModalOpen}
          onClose={() => setIsGigModalOpen(false)}
          freelancers={freelancers}
        />
      </div>
    </>
  );
}
