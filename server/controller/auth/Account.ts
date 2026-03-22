import { FastifyRequest, FastifyReply, FastifyRequestContext } from "fastify";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../../lib/prisma_client";
import { InternalServerError } from "../../lib/apiResponse/ErrorRes";

import { sendEmail } from "../../mail/nodemailer.config";
import { PassResetOtp } from "../../mail/templates/PassResetOtp";
import { hashPassword, verifyPassword } from "../../lib/crypt/passwordVerify";
import { createJwtToken, verifyJwtToken } from "../../lib/crypt/jwtTokens";
import { generatePasswordResetToken } from "../../lib/random/passwordForgetToken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = (request as any).user;

    if (!user?.id) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const file = await (request as any).file();

    if (!file) {
      reply.status(400).send({
        success: false,
        message: "No file uploaded",
        errorCode: "NO_FILE",
      });
      return;
    }

    const buffer = await file.toBuffer();

    const fileStr = `data:${file.mimetype};base64,${buffer.toString("base64")}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_images",
    });

    if (!uploadedResponse.secure_url) {
      reply.status(500).send({
        success: false,
        message: "Upload failed",
        errorCode: "AVATAR_UPLOAD_FAILED",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: uploadedResponse.secure_url },
    });

    reply.status(200).send({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        id: updatedUser.id,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

export const forgetPasswordToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { email } = request.body as { email?: string };

    if (!email) {
      reply.status(400).send({
        success: false,
        message: "Email is required",
        errorCode: "EMAIL_REQUIRED",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    const passwordResetToken = await generatePasswordResetToken();
    const passwordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.forgetPassword.upsert({
      where: { userId: user.id },
      update: {
        passwordResetToken,
        passwordExpiry,
      },
      create: {
        userId: user.id,
        passwordResetToken,
        passwordExpiry,
      },
    });

    const emailSent = await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: PassResetOtp(passwordResetToken),
    });

    if (!emailSent) {
      reply.status(500).send({
        success: false,
        message: "Failed to send password reset email. Please try again later.",
        errorCode: "EMAIL_SEND_FAILED",
      });
      return;
    }

    reply.status(200).send({
      success: true,
      message: "Password reset token sent successfully",
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

interface VerifyForgotPasswordBody {
  email?: string;
  otp?: string;
}

export const verifyForgotPasswordOtp = async (
  request: FastifyRequest<{ Body: VerifyForgotPasswordBody }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      reply.status(400).send({
        success: false,
        message: "Email and OTP are required",
        errorCode: "OTP_EMAIL_REQUIRED",
      });
      return;
    }

    const forgetPassword = await prisma.forgetPassword.findFirst({
      where: {
        user: { email },
      },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!forgetPassword) {
      reply.status(404).send({
        success: false,
        message: "No OTP request found for this email",
        errorCode: "OTP_NOT_REQUESTED",
      });
      return;
    }

    // Validate OTP
    if (forgetPassword.passwordResetToken !== otp) {
      reply.status(400).send({
        success: false,
        message: "Incorrect OTP",
        errorCode: "INVALID_OTP",
      });
      return;
    }

    // Check expiry
    if (new Date() > forgetPassword.passwordExpiry) {
      reply.status(400).send({
        success: false,
        message: "OTP expired",
        errorCode: "OTP_EXPIRED",
      });
      return;
    }

    // Create short-lived reset JWT
    const resetKey = createJwtToken(
      { email: forgetPassword.user.email },
      "jwt",
      "10m",
    );

    // Invalidate OTP after successful verification
    await prisma.forgetPassword.delete({
      where: { id: forgetPassword.id },
    });

    reply.status(200).send({
      success: true,
      message: "OTP verified successfully",
      data: {
        resetKey,
      },
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

interface ResetPasswordBody {
  password?: string;
}

export const resetPassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.status(401).send({
        success: false,
        message: "Missing or invalid reset token",
        errorCode: "MISSING_RESET_TOKEN",
      });
      return;
    }

    const resetKey = authHeader.split(" ")[1];

    let payload: { email?: string };
    try {
      payload = verifyJwtToken(resetKey, "jwt") as {
        email?: string;
      };
    } catch {
      reply.status(401).send({
        success: false,
        message: "Invalid or expired reset token",
        errorCode: "INVALID_RESET_TOKEN",
      });
      return;
    }

    if (!payload?.email) {
      reply.status(401).send({
        success: false,
        message: "Invalid reset token payload",
        errorCode: "INVALID_RESET_PAYLOAD",
      });
      return;
    }

    const { password } = request.body as ResetPasswordBody;
    if (!password) {
      reply.status(400).send({
        success: false,
        message: "New password is required",
        errorCode: "NEW_PASSWORD_REQUIRED",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (!user) {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    reply.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

interface ChangePasswordBody {
  oldPassword?: string;
  newPassword?: string;
}

export const changePassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const supabase_user = request.user;

    if (!supabase_user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        supabaseId: supabase_user.id,
      },
    });

    if (!user || !user?.id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }
    const { oldPassword, newPassword } = request.body as ChangePasswordBody;

    if (!user?.id || !oldPassword || !newPassword) {
      reply.status(400).send({
        success: false,
        message: "Old password and new password are required",
        errorCode: "OLD_NEW_PASSWORD_REQUIRED",
      });
      return;
    }

    if (oldPassword === newPassword) {
      reply.status(400).send({
        success: false,
        message: "New password cannot be same as old password",
        errorCode: "PASSWORD_SAME_AS_OLD",
      });
      return;
    }

    const userDB = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!userDB?.password) {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    const passwordMatch = await verifyPassword(oldPassword, userDB.password);

    if (!passwordMatch) {
      reply.status(400).send({
        success: false,
        message: "Old password is incorrect",
        errorCode: "INCORRECT_OLD_PASSWORD",
      });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    reply.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

const ALLOWED_PROFILE_FIELDS = [
  "name",
  "company",
  "phone",
  "country",
  "timezone",
] as const;

type AllowedProfileField = (typeof ALLOWED_PROFILE_FIELDS)[number];

interface UpdateProfileBody {
  data?: Partial<Record<AllowedProfileField, string | null>>;
}

export const updateProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = (request.body as any)?.user;
    const { data } = request.body as UpdateProfileBody;

    if (!user?.id) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
      return;
    }

    if (!data || typeof data !== "object") {
      reply.status(400).send({
        success: false,
        message: "Profile data is required",
        errorCode: "DATA_REQUIRED",
      });
      return;
    }

    const updateData: Record<string, any> = {};

    for (const key of ALLOWED_PROFILE_FIELDS) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      reply.status(400).send({
        success: false,
        message: "No valid profile fields provided",
        errorCode: "NO_VALID_FIELDS",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        company: true,
        phone: true,
        updatedAt: true,
      },
    });

    reply.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

export const deleteAccount = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = (request.body as any)?.user;

    if (!user?.id) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!existingUser) {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: user.id } }),
      prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
      prisma.userNotificationPreference.deleteMany({
        where: { userId: user.id },
      }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    reply.status(200).send({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

export const getUserDetails = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const supabase_user = request.user;

    if (!supabase_user) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        supabaseId: supabase_user.id,
      },
    });

    if (!user || !user?.id) {
      reply.status(401).send({
        message: "Unauthorized",
        status: "Failed",
        errorCode: "err_verifying_user",
      });
      return;
    }
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        authTypes: true,
        userData: {
          select: {
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
      },
    });

    if (!userData) {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    reply.status(200).send({
      success: true,
      status: "Success",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        authTypes: userData.authTypes,
        claims: {
          freePlan: true,
        },
        addressInfo: {
          address: userData.userData?.address || "",
          city: userData.userData?.city || "",
          state: userData.userData?.state || "",
          zipCode: userData.userData?.zipCode || "",
          country: userData.userData?.country || "",
        },
      },
    });
  } catch (error) {
    request.log.error(error);
    InternalServerError(reply as any, error);
  }
};

interface RefreshTokenPayload {
  id: string;
  email?: string;
}

export const refreshAccessToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      reply.status(401).send({
        message: "Refresh token not found",
        status: "Failed",
        errorCode: "REFRESH_TOKEN_MISSING",
      });
      return;
    }

    let payload: RefreshTokenPayload;

    try {
      payload = verifyJwtToken(refreshToken, "refresh") as RefreshTokenPayload;
    } catch {
      reply.status(401).send({
        message: "Invalid or expired refresh token",
        status: "Failed",
        errorCode: "REFRESH_TOKEN_INVALID",
      });
      return;
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.id,
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (!storedToken) {
      reply.status(401).send({
        message: "Refresh token revoked or expired",
        status: "Failed",
        errorCode: "REFRESH_TOKEN_REVOKED",
      });
      return;
    }

    const newAccessToken = createJwtToken(
      { id: payload.id, email: payload.email },
      "access",
      "15m",
    );

    reply
      .setCookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 15 * 60,
      })
      .status(200)
      .send({
        message: "Access token refreshed",
        status: "Success",
      });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({
      message: "Internal Server Error",
      status: "Failed",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

interface UserWebsitesAnalyticsBody {
  websiteId?: string;
}

export const getUserWebsitesAnalytics = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = (request.body as any)?.user;
    const websiteId =
      (request.body as UserWebsitesAnalyticsBody).websiteId ?? null;

    if (!user?.id) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
      return;
    }

    if (websiteId !== null && typeof websiteId !== "string") {
      reply.status(400).send({
        success: false,
        message: "Invalid websiteId",
        errorCode: "INVALID_WEBSITE_ID",
      });
      return;
    }

    const websites = await prisma.website.findMany({
      where: websiteId
        ? { id: websiteId, userId: user.id as string }
        : { userId: user.id as string },
      select: {
        id: true,
        name: true,
        url: true,
        forms: { select: { id: true } },
      },
    });

    if (websites.length === 0) {
      reply.send({
        websites: [],
        leadCounts: { total: 0, partial: 0, completed: 0 },
        visitorDataByCountry: [],
        visitorDataByRegion: [],
        visitorDataByCity: [],
        mostActiveForm: null,
      });
      return;
    }
    const websiteIds: string[] = websites.map((w) => w.id);

    const [
      totalLeads,
      completedLeads,
      partialLeads,
      countryRaw,
      regionRaw,
      cityRaw,
      leadCountsByForm,
    ] = await Promise.all([
      prisma.lead.count({ where: { websiteId: { in: websiteIds } } }),
      prisma.lead.count({
        where: { websiteId: { in: websiteIds }, conversion: true },
      }),
      prisma.lead.count({
        where: { websiteId: { in: websiteIds }, conversion: false },
      }),
      prisma.lead.groupBy({
        by: ["country"],
        where: { websiteId: { in: websiteIds } },
        _count: { country: true },
      }),
      prisma.analytics.groupBy({
        by: ["region"],
        where: { websiteId: { in: websiteIds } },
        _count: { region: true },
        orderBy: { _count: { region: "desc" } },
      }),
      prisma.analytics.groupBy({
        by: ["city"],
        where: { websiteId: { in: websiteIds } },
        _count: { city: true },
        orderBy: { _count: { city: "desc" } },
      }),
      prisma.lead.groupBy({
        by: ["formId"],
        where: { websiteId: { in: websiteIds } },
        _count: { formId: true },
        orderBy: { _count: { formId: "desc" } },
        take: 1,
      }),
    ]);

    let mostActiveForm = null;

    if (leadCountsByForm.length > 0) {
      const topFormId = leadCountsByForm[0].formId;
      const form = await prisma.form.findUnique({
        where: { id: topFormId },
        select: { id: true, formName: true, websiteId: true },
      });

      if (form) {
        mostActiveForm = {
          id: form.id,
          formName: form.formName,
          websiteId: form.websiteId,
          leadCount: leadCountsByForm[0]._count.formId,
        };
      }
    }

    reply.send({
      // @ts-ignore
      websites: websites.map((w) => ({
        id: w.id,
        name: w.name,
        url: w.url,
        formCount: w.forms.length,
      })),
      leadCounts: {
        total: totalLeads,
        partial: partialLeads,
        completed: completedLeads,
      },
      // @ts-ignore
      visitorDataByCountry: countryRaw.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
      // @ts-ignore
      visitorDataByRegion: regionRaw.map((r) => ({
        region: r.region,
        count: r._count.region,
      })),
      // @ts-ignore
      visitorDataByCity: cityRaw.map((c) => ({
        city: c.city,
        count: c._count.city,
      })),
      mostActiveForm,
    });
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

const ALLOWED_USER_DATA_FIELDS = [
  "address",
  "city",
  "state",
  "zipCode",
  "country",
] as const;

type AllowedUserDataField = (typeof ALLOWED_USER_DATA_FIELDS)[number];

interface UpdateUserDataBody {
  data?: Partial<Record<AllowedUserDataField, string | null>>;
}

export const updateUserData = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = (request as any)?.user;
    const { data } = request.body as UpdateUserDataBody;

    if (!user?.id) {
      reply.status(401).send({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
      return;
    }

    if (!data || typeof data !== "object") {
      reply.status(400).send({
        success: false,
        message: "Valid data object is required",
        errorCode: "INVALID_DATA_INPUT",
      });
      return;
    }

    const updateData: Record<string, any> = {};

    for (const field of ALLOWED_USER_DATA_FIELDS) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      reply.status(400).send({
        success: false,
        message: "No valid user data fields provided",
        errorCode: "NO_VALID_FIELDS",
      });
      return;
    }

    const updatedUserData = await prisma.userData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...updateData,
      },
      update: updateData,
      select: {
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
      },
    });

    reply.status(200).send({
      success: true,
      message: "User data updated successfully",
      data: updatedUserData,
    });
  } catch (error: any) {
    request.log.error(error);

    if (error?.code === "P2025") {
      reply.status(404).send({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
      return;
    }

    reply.status(500).send({
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

