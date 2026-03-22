import { NextFunction, Response, Request } from "express";
import { z, ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingFields = error.errors.map((err) => err.path.join("."));
        return res.status(400).json({
          message: "Validation failed",
          missingFields,
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Add all validation Schemas here
export const websiteCreateSchema = z.object({
  website_name: z.string().nonempty("Website name is required"),
  website_url: z.string().url("Invalid URL format"),
  website_description: z.string().nonempty("Website description is required"),
  website_status: z.boolean(), // Must be a boolean
  notification_info: z.object({
    username: z.string().nonempty("Username is required"),
    email: z.string().email("Invalid email format"),
  }),
});
