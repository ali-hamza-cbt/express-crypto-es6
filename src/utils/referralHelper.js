import User from "../models/userModel.js";

export const generateReferralCode = async () => {
  let referralCode;
  let isUnique = false;

  while (!isUnique) {
    referralCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character code
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return referralCode;
};
