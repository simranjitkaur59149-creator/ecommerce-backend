import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: { type: Number, required: true },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
