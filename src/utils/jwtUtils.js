import jwt from "jsonwebtoken";

// Secret key for JWT signing (store in an environment variable in a production app)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to generate JWT token
export const generateToken = (userId) => {
  const payload = { userId }; // Store only necessary data
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};

// Function to verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // If token is invalid or expired
  }
};
