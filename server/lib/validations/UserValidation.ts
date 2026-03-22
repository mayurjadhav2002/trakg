import { PlanAuthorization } from "../constants";
import prisma from "../prisma_client";

export const UserInformation = async (userId: string): Promise<any> => {
  try {
    if (!userId) {
      return {
        error: "invalid_user_id",
        message: "Valid user ID is required",
        status: "Error",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      return {
        error: "user_not_found",
        message: "User not found",
        status: "Error",
      };
    }

    return {
      success: true,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    return {
      error: "internal_error",
      message: "An internal server error occurred",
      status: "Error",
      details: error instanceof Error ? error.message : String(error),
    };
  }
};
