import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../models/order.model'

// Define Order Schema
const OrderSchema: Schema = new Schema({
  status: { type: String, enum: ['pending', 'completed', 'shipped', 'cancelled'], required: true },
  orderItems: [{
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    color: { type: String, required: false },
    colorPhotoUrl: { type: String },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    shippingCoast: { type: Number, required: true },
    totalShipping: { type: Number, required: true },
  }],
  subTotal: { type: Number, required: true },
  totalShipping: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, {
  toJSON: {
    virtuals: true, transform: function (doc, ord) {
      ord.id = ord._id;
      delete ord._id;
      delete ord.__v;
    }
  }
});

// Define Order Model
const MngOrder = mongoose.model<Document & IOrder>('Orders', OrderSchema);

export default MngOrder;
