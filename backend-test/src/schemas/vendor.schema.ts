import { Schema, Document } from 'mongoose';

export const VendorSchema = new Schema({
  name: String,
});

export interface Vendor extends Document {
  name: string;
}
