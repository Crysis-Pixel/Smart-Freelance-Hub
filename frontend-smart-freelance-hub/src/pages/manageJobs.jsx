import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import GigContainerModal from "../components/GigContainerModal";
import AddOtherSkill from "../components/AddOtherSkill";
import FinishJobModal from "../components/FinishJobModal.jsx";

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
    maxBudget: "",
  });
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [freelancers, setFreelancers] = useState(null);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [isOtherSkillModalOpen, setIsOtherSkillModalOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isFinishJobModalOpen, setIsFinishJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const availableSkills = [
    "Accounting & Bookkeeping",
    "AI (Artificial Intelligence)",
    "Application Developer",
    "Blockchain Development",
    "Content Writing",
    "Copywriting",
    "Data Analyst",
    "Digital Marketing",
    "E-commerce",
    "Financial Analysis",
    "Game Developer",
    "Graphics Designer",
    "IT Support",
    "Machine Learning",
    "Mobile App Development",
    "Photo Editor",
    "Project Management",
    "SEO Analyst",
    "Social Media Marketing",
    "Technical Writing",
    "Translation",
    "UI/UX Design",
    "Video Editor",
    "Virtual Assistance",
    "Web Design",
    "Web Development",
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

  const handleEdit = (job) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      description: job.description,
      maxBudget: job.maxBudget,
    });

    // Check if requirements is an array or string, and handle accordingly
    if (Array.isArray(job.requirements)) {
      setSelectedSkills(job.requirements); // Directly use the array if it's already an array
    } else if (typeof job.requirements === "string") {
      setSelectedSkills(job.requirements.split(", "));
    } else {
      setSelectedSkills([]);
    }

    setIsEditModalOpen(true);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const toggleChat = (email) => {
    setFreelancerEmail(email);

    setIsChatOpen((prev) => !prev);
  };

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;

    if (selectedSkill === "Other") {
      setIsOtherSkillModalOpen(true);
    } else {
      if (!selectedSkills.includes(selectedSkill)) {
        setSelectedSkills((prevSkills) => [...prevSkills, selectedSkill]);
      }
    }
  };

  const handlePostJob = async () => {
    if (!newJob.title.trim()) {
      alert("Please enter a job title.");
      return;
    }
    if (!newJob.description.trim()) {
      alert("Please enter a job description.");
      return;
    }
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }
    if (!newJob.maxBudget || newJob.maxBudget <= 0) {
      alert("Please enter a valid maximum budget greater than 0.");
      return;
    }

    const jobDetails = {
      title: newJob.title,
      description: newJob.description,
      requirements: selectedSkills.join(", "),
      maxBudget: newJob.maxBudget,
      clientEmail: JSON.parse(sessionStorage.getItem("user")).email,
      jobId: editingJob ? editingJob._id : null,
    };

    try {
      let response;
      if (editingJob) {
        response = await fetch("http://localhost:3000/jobs/editJob", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobDetails),
        });
      } else {
        response = await fetch("http://localhost:3000/jobs/postJob", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobDetails),
        });
      }

      if (response.status !== 200) {
        throw new Error("Failed to save job");
      }

      const postedJob = await response.json();
      if (editingJob) {
        // Replace the edited job in the jobs list
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === postedJob._id ? postedJob : job))
        );
      } else {
        setJobs((prevJobs) => [postedJob, ...prevJobs]);
      }
      setIsModalOpen(false);
      setNewJob({
        title: "",
        description: "",
        requirements: [],
        maxBudget: "",
      });
      setSelectedSkills([]);
      setEditingJob(null);

      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (jobId) => {
    console.log(jobId);
    try {
      const response = await fetch("http://localhost:3000/jobs/cancelJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete job: ${response.statusText}`);
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
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
      console.log(freelancersData);
      setFreelancers(freelancersData);
      setIsGigModalOpen(job._id);
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

  const handleFinishJob = (job) => {
    setSelectedJob(job);
    setIsFinishJobModalOpen(true);
  };

  const handleFinishJobConfirm = (paymentAmount, review) => {
    console.log("Job Finished!", paymentAmount, review);

    setIsFinishJobModalOpen(false);
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
                <div
                  key={index}
                  className="border p-5 rounded-md shadow-sm relative"
                >
                  <div
                    className={`absolute right-10 badge border-none ${
                      job.status === "unassigned"
                        ? "bg-orange-400"
                        : job.status === "pending"
                        ? "bg-yellow-400"
                        : job.status === "assigned"
                        ? "bg-green-200"
                        : job.status === "declined"
                        ? "bg-red-400"
                        : ""
                    }`}
                  >
                    {job.status}
                  </div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-gray-600">
                    <b>Max budget: $</b>
                    {job.maxBudget}
                  </p>
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

                  <div className="flex justify-between">
                    <div className="flex gap-2 mt-3">
                      {job.status === "unassigned" && (
                        <button
                          className="btn btn-outline"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </button>
                      )}
                      {job.status === "unassigned" && (
                        <button
                          className="btn btn-error"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </button>
                      )}
                      {job.status === "assigned" && (
                        <button
                          className="btn btn-success"
                          onClick={() => toggleChat(job.freelancerEmail)}
                        >
                          Contact Freelancer
                        </button>
                      )}

                      {(job.status === "unassigned" ||
                        job.status === "declined") && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleFindFreelancers(job)}
                        >
                          Find Freelancer
                        </button>
                      )}
                    </div>
                    <div>
                      {job.status === "assigned" && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleFinishJob(job)}
                        >
                          Finish Job
                        </button>
                      )}
                    </div>
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

              <label className="block mb-3">
                <span className="text-gray-700">Max Budget</span>
                <input
                  type="number"
                  name="maxBudget"
                  value={newJob.maxBudget}
                  onChange={handleInputChange}
                  min="0"
                  inputMode="numeric"
                  className="input input-bordered w-full mt-2"
                  placeholder="Enter maximum budget"
                  style={{
                    "-moz-appearance": "textfield",
                    "-webkit-appearance": "none",
                  }}
                />
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

        {isEditModalOpen && editingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 w-1/2">
              <h2 className="text-2xl font-semibold mb-5">Edit Job</h2>

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

              <label className="block mb-3">
                <span className="text-gray-700">Max Budget</span>
                <input
                  type="number"
                  name="maxBudget"
                  value={newJob.maxBudget}
                  onChange={handleInputChange}
                  min="0"
                  inputMode="numeric"
                  className="input input-bordered w-full mt-2"
                  placeholder="Enter maximum budget"
                  style={{
                    "-moz-appearance": "textfield",
                    "-webkit-appearance": "none",
                  }}
                />
              </label>

              <div className="flex justify-end mt-5">
                <button
                  className="btn btn-secondary mr-3"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handlePostJob}>
                  Update Job
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
          isOpen={Boolean(isGigModalOpen)}
          onClose={() => setIsGigModalOpen(false)}
          freelancers={freelancers}
          jobId={isGigModalOpen}
          maxBudget={
            jobs.find((job) => job._id === isGigModalOpen)?.maxBudget || 0
          }
        />
        <ChatBox
          isOpen={isChatOpen}
          onClose={toggleChat}
          email={freelancerEmail}
        />

        <FinishJobModal
          isOpen={isFinishJobModalOpen}
          onClose={() => setIsFinishJobModalOpen(false)}
          onConfirm={handleFinishJobConfirm}
          job={selectedJob}
        />
      </div>
    </>
  );
}
