// src/components/ProfilePictureUpload.jsx
import React, { useState } from "react";
import api from "../utils/api";

const ProfilePictureUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      // Optional: Start loading
      const response = await api.post(
        "/api/profile/upload-profile-picture",
        formData
      );

      const uploadedProfilePicture = response.data
        ? response.data.profilePicture
        : response.profile_picture;

      onUpload(uploadedProfilePicture);
      alert("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile picture", error);
      alert(error || "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default ProfilePictureUpload;
