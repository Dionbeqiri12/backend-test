import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema({
  productId: { type: String, required: true, unique: true },
  itemId: { type: String, required: true },
  name: String,
  description: String,
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  manufacturerId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
});

export interface Product extends Document {
  productId: string;
  itemId: string;
  name: string;
  description: string;
  vendorId: string;
  manufacturerId: string;
}
