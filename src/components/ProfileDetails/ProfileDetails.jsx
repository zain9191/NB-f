import React, { useState } from "react";
import ProfilePictureUpload from "../ProfilePictureUpload";
import "./ProfileDetails.css";

const ProfileDetails = ({ profile, onUpload }) => {
  const [imageError, setImageError] = useState(false);

  const profilePictureUrl = profile?.profilePicture?.startsWith("uploads/")
    ? `http://localhost:5080/${profile.profilePicture}`
    : profile?.profilePicture || "/uploads/default-pp.png";

  return (
    <div className="profile-details">
      <div className="profile-section">
        <img
          className="profile-pic"
          // src={imageError ? "/uploads/default-pp.png" : profilePictureUrl}
          src={profilePictureUrl}
          alt="Profile"
          onError={() => setImageError(true)}
        />
        <ProfilePictureUpload onUpload={onUpload} />
      </div>
      <div className="info-section">
        <p>
          <strong>Full Name:</strong> {profile.full_name}
        </p>
        <p>
          <strong>Username:</strong> {profile.username}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone_number}
        </p>
      </div>
    </div>
  );
};

export default ProfileDetails;
