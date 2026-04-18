import express from "express";

import {
  addToCart,
  getproductsbyid,
  login,
  register,
  removeFromCart,

} from "./controller.js";
import protectedRoutes from "./protectRoutes.js";
const routes = express.Router();

routes.post("/register", register);

routes.post("/login", login);
routes.get("/cart", protectedRoutes, getproductsbyid);
routes.post("/addtocart", protectedRoutes, addToCart);
routes.delete("/cart/:productId", protectedRoutes, removeFromCart);
export default routes;
