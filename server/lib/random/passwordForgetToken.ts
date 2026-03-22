import crypto from 'crypto';
export async function generatePasswordResetToken() {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character alphanumeric
  }
  
  