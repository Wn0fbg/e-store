import crypto from "crypto";

export const createTempToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};
