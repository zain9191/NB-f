import React, { useState } from "react";
// import "./BecomeChefModal.css";

const BecomeChefModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [specialty, setSpecialty] = useState("");
  const [specialtyError, setSpecialtyError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!specialty.trim()) {
      setSpecialtyError("Specialty is required.");
      return;
    }
    if (specialty.trim().length < 3) {
      setSpecialtyError("Specialty must be at least 3 characters long.");
      return;
    }
    setSpecialtyError(null);
    onSubmit(specialty.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Become a Chef</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="specialty">Specialty:</label>
          <input
            type="text"
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            placeholder="Enter your culinary specialty"
          />
          {specialtyError && <p className="error">{specialtyError}</p>}
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeChefModal;
