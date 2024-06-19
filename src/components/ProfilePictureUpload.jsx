import React, { useState } from "react";
import axios from "axios";
import config from "../config"; // Import configuration

const ProfilePictureUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${config.apiBaseUrl}/api/profile/upload-profile-picture`, // Use config for base URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpload(response.data.profilePicture);
      alert("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile picture", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ProfilePictureUpload;
