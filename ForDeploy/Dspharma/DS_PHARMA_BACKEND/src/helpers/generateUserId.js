import crypto from "crypto";

export const generateUserId = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(length);

  let userId = "";
  for (let i = 0; i < length; i++) {
    userId += chars[bytes[i] % chars.length];
  }

  return userId;
};
