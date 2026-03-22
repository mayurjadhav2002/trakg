"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import ProfileImage from "./profile/ProfileImage";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

function General() {
  const {
    profile,
    uploading,
    loading,
    updateField,
    uploadAvatar,
    updateProfile,
    handleUpdate,
  } = useProfile();

  const fileInputRef = useRef(null);

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    await uploadAvatar(file);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    await updateProfile();
  };
  return (
    <div className="w-full  mx-auto px-3 py-0 space-y-6  rounded-lg ">
      <ProfileImage
        reference={fileInputRef}
        avatar={profile.avatar}
        handleUploadImage={handleUploadImage}
        uploading={uploading}
      />

      <form onSubmit={handleSubmitData} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name || ""}
            onChange={handleUpdate}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={profile.company || ""}
            onChange={handleUpdate}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profile.phone || ""}
            onChange={handleUpdate}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123-456-7890"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email || ""}
            onChange={handleUpdate}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default General;
