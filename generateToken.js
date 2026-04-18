import jwt from "jsonwebtoken";
export const JWT_SECRET = "token-secret-key";
const genToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "2d" });
};
export default genToken;
