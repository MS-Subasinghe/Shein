import mongoose from 'mongoose';

const clothesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  category: { type: String },
  sizes: [String],    // e.g. ['S', 'M', 'L']
  colors: [String],   // e.g. ['Red', 'Blue']
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Clothes', clothesSchema);
