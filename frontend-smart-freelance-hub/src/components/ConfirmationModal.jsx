import React from "react";

export default function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Verify Your Email?</h2>
        <p className="mb-6">Do you want to verify your email now or later?</p>
        <div className="flex justify-end gap-4">
          <button className="btn btn-secondary" onClick={onCancel}>
            Verify Later
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}
