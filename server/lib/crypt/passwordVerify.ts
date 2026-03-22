import bcrypt from "bcrypt";

// Set the salt rounds (cost factor for bcrypt)
const SALT_ROUNDS = 12; // Higher values increase security but slow down hashing

/**
 * Hash a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password cannot be empty");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS); // Generate salt
  const hashedPassword = await bcrypt.hash(password, salt); // Hash password with salt
  return hashedPassword;
}

/**
 * Verify a plain text password against a hashed password.
 * @param plainPassword - The plain text password.
 * @param hashedPassword - The hashed password from the database.
 * @returns True if the passwords match, false otherwise.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string | null
): Promise<boolean> {
  if (!plainPassword || !hashedPassword) {
    throw new Error("Both plain and hashed passwords must be provided");
  }
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}
