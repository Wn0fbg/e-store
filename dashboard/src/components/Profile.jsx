import React, { useState } from "react";
import Avatar from "../assets/avatar.jpg";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdminPassword,
  updateAdminProfile,
} from "../store/slices/authSlice";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [updatingSection, setUpdatingSection] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleProfileChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    formData.append("avatar", avatar);
    setUpdatingSection("Profile");
    dispatch(updateAdminProfile(formData));
  };

  const updatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", passwordData.currentPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmNewPassword", passwordData.confirmNewPassword);
    setUpdatingSection("Password");
    dispatch(updateAdminPassword(formData));
  };

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* Header */}
        <div className="flex-1 md:p-6 md:pb-0">
          <Header />
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-gray-600">Manage your profile.</p>
        </div>

        {/* Content */}
        <div className="max-w-4xl md:px-4 py-8">
          {/* Profile card */}
          <div
            className={`bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row 
            items-center gap-6 mb-10`}
          >
            <img
              src={(user && user?.avatar?.url) || Avatar}
              alt={user?.name || Avatar}
              className="size-32 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-xl font-medium">Name: {user.name}</p>
              <p className="text-md text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-blue-500">Role: {user.role}</p>
            </div>
          </div>

          {/* Update profile section */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-md mb-10">
            <h3 className="text-xl font-semibold mb-4">Update profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleProfileChange}
                className="p-2 border rounded-md"
                placeholder="Your name"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleProfileChange}
                className="p-2 border rounded-md"
                placeholder="Your email address"
              />
              <input
                type="file"
                name="avatar"
                onChange={handleAvatarChange}
                className="p-2 border rounded-md col-span-1 md:col-span-2"
              />
            </div>
            <button
              onClick={updateProfile}
              type="submit"
              className={`flex justify-center items-center gap-2 rounded-lg bg-blue-600
              hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-all`}
              disabled={loading}
            >
              {loading && updatingSection === "Profile" ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating profile...</span>
                </>
              ) : (
                "Update profile"
              )}
            </button>
          </div>

          {/* Update password section */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Update password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="Current password"
              />
              <input
                type="text"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="New password"
              />
              <input
                type="text"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="Confirm new password"
              />
            </div>
            <button
              onClick={updatePassword}
              type="submit"
              className={`flex justify-center items-center gap-2 rounded-lg bg-blue-600
              hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-all mt-2`}
              disabled={loading}
            >
              {loading && updatingSection === "Password" ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                "Update password"
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
