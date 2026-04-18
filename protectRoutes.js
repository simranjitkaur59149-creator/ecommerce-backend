import jwt from "jsonwebtoken";

import User from "./model/userModel.js";
// import User from "./model.js";
const protectedRoutes = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized! Invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};
export default protectedRoutes;
