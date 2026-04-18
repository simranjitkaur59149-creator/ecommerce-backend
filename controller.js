import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./model/userModel.js";
import genToken from "./generateToken.js";
import Cart from "./model/cartModel.js";
const saltRound = 12;
export const register = async (req, res, next) => {
  try {
    console.log(req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, saltRound);

    const user = await User.create({
      username: username,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: genToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Both Fields are required" });
  }
  const userEmail = await User.findOne({ email });
  if (!userEmail) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const isMatch = await bcrypt.compare(password, userEmail.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invaild Email and Password" });
  }
  res.status(200).json({
    user: {
      id: userEmail._id,
      username: userEmail.username,
      email: userEmail.email,
    },
    token: genToken(userEmail._id),
  });
};
export const getproductsbyid = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ user: userId });
    let total=0
    cartItems.forEach((item)=>{
      total+=item.price*item.quantity

    })
    console.log("cart:", cartItems);
    res.json({total,cartItems});
  } catch (error) {
    res.json({ error: error.message });
  }
};
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, title, price } = req.body;

    // check if product already exists in cart
    const existing = await Cart.findOne({ user: userId, productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      user: userId,
      productId,
      title,
      price,
      quantity: 1,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
  
const item=await Cart.findOne({user:userId,productId:productId})
if(!item)
{
  return res.status(404).json({error:"Item not found"})
}
if(item.quantity>1){
  item.quantity-=1
  await item.save()
  return res.json(item)
  
}
else{


    const deletedItem = await Cart.findOneAndDelete({
      user: userId,
      productId: productId,
    });
    return res.json({message:"Item deleted from cart successfully",deletedItem})
  }

} catch (error) {

    res.status(500).json({ error: error.message });
  }
};
