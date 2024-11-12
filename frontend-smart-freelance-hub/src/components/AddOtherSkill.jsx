import React from "react";

export default function AddOtherSkill({
  isOpen,
  onClose,
  onSubmit,
  skill,
  setSkill,
}) {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setSkill(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box p-6 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Enter Custom Skill
        </h2>
        <input
          type="text"
          className="input input-bordered w-full p-4 rounded-md"
          value={skill}
          onChange={handleInputChange}
          placeholder="Enter your custom skill"
        />
        <div className="modal-action flex justify-between mt-6">
          <button
            className="btn btn-primary px-6 py-2 rounded-md text-black font-semibold"
            onClick={handleSubmit}
          >
            Add Skill
          </button>
          <button
            className="btn btn-secondary px-6 py-2 rounded-md text-black font-semibold focus:ring-"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
