import { z } from "zod";

export const zSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(64, { message: "Password must at most 64 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain  al least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain  al least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s]/, {
      message: "name can only contain letters and spaces",
    }),
});
