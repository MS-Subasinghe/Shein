import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  clothesId: { type: mongoose.Schema.Types.ObjectId, ref: "Clothes", required: true }, // changed to clothesId (small d)
  quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
