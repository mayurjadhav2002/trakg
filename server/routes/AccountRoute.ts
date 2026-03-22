import { FastifyInstance } from "fastify";

import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../controller/auth/Notifications";

import {
  changePassword,
  deleteAccount,
  forgetPasswordToken,
  getUserDetails,
  getUserWebsitesAnalytics,
  resetPassword,
  updateProfile,
  updateUserData,
  uploadAvatar,
  verifyForgotPasswordOtp,
} from "../controller/auth/Account";

import { AuthMiddleware } from "../middleware/auth.middlware";

export default async function AccountRoutes(app: FastifyInstance) {
  // Upload avatar
  app.post("/account/avatar/new", { preHandler: AuthMiddleware }, uploadAvatar);

  // Change password
  app.post(
    "/account/user/password/change",
    { preHandler: AuthMiddleware },
    changePassword,
  );

  // Update profile
  app.put(
    "/account/user/UpdateProfile",
    { preHandler: AuthMiddleware },
    updateProfile,
  );

  // Delete account
  app.delete(
    "/account/user/delete",
    { preHandler: AuthMiddleware },
    deleteAccount,
  );

  // Password reset token
  app.post("/account/password/resetToken", forgetPasswordToken);

  // Verify token
  app.post("/account/password/verifyToken", verifyForgotPasswordOtp);

  // Reset password
  app.post("/account/password/resetPassword", resetPassword);

  // Get account details
  app.get("/account/me", { preHandler: AuthMiddleware }, getUserDetails);

  // Analytics
  app.post(
    "/account/getAnalytics",
    { preHandler: AuthMiddleware },
    getUserWebsitesAnalytics,
  );

  app.get(
    "/account/notification",
    { preHandler: AuthMiddleware },
    getNotificationSettings,
  );

  app.post(
    "/account/notification/update",
    { preHandler: AuthMiddleware },
    updateNotificationSettings,
  );

  // Update user data
  app.post("/account/userdata", { preHandler: AuthMiddleware }, updateUserData);
}
