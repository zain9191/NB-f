import React from "react";
// import "./ChefSection.css";

const ChefSection = ({
  profile,
  onBecomeChef,
  isBecomingChef,
  becomeChefError,
  becomeChefSuccess,
}) => {
  return (
    <div className="chef-section">
      {!profile.isChef ? (
        <div className="become-chef">
          <button
            className="button become-chef-button"
            onClick={onBecomeChef}
            disabled={isBecomingChef}
          >
            {isBecomingChef ? "Becoming Chef..." : "Become a Chef"}
          </button>
          {becomeChefError && <p className="error">{becomeChefError}</p>}
          {becomeChefSuccess && <p className="success">{becomeChefSuccess}</p>}
        </div>
      ) : (
        <div className="chef-profile">
          <h2>Your Chef Profile</h2>
          <p>
            <strong>Specialty:</strong> {profile.chefSpecialty}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChefSection;
