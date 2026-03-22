import React from "react";

function ProfileImage({ avatar, reference, handleUploadImage, uploading }) {
  return (
    <div className="flex items-center space-x-4" ref={reference}>
      <div className="shrink-0 relative">
        <img
          id="preview_img"
          className="h-16 w-16 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
          src={avatar || "https://lh3.googleusercontent.com/a-/AFdZucpC_6WFBIfaAbPHBwGM9z8SxyM1oV4wB4Ngwp_UyQ=s96-c"}
          alt="Profile Picture"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded-full">
            Uploading...
          </div>
        )}
      </div>
      <label className="block cursor-pointer">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Photo</span>
        <input
          type="file"
          onChange={handleUploadImage}
          className="hidden"
          accept="image/*"
        />
      </label>
    </div>
  );
}

export default ProfileImage;
