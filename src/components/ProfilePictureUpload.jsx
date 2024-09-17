import React, { useState } from "react";
import api from "../utils/api";

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
      const response = await api.post(
        `/api/profile/upload-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpload(response.data.profile_picture);
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
