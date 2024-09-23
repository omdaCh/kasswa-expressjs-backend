import mongoose, { Schema, Document } from "mongoose";

const ItemSizeSchema: Schema = new Schema({
    name: { type: String, required: false },
    available: { type: Boolean, required: false }
});

const ItemColorSchema: Schema = new Schema({
    coloreName: { type: String, required: false },
    sizes: { type: [ItemSizeSchema], required: false },
    photos: { type: [String], required: false }
});

const ItemBrandSchema: Schema = new Schema({
    name: { type: String, required: false }
});

const ItemSchema: Schema = new Schema({
    id: { type: Number, required: false },
    name: { type: String, required: true },
    description: { type: String, required: false },
    colors: { type: [ItemColorSchema], required: false },
    price: { type: Number, required: false },
    discountedPrice: { type: Number, required: false },
    nbrSold: { type: Number, required: false },
    rating: { type: Number, required: false },
    numberOfReviews: { type: Number, required: false },
    brand: { type: ItemBrandSchema, required: false },
    gender: { type: String, required: false, enum: ['male', 'female'] },
    age: { type: String, required: false, enum: ['kids', 'adulte'] },
    category: { type: String, required: false },
    shippingCoast: { type: Number, required: false }
},
    {
        toJSON: {
            virtuals: true, // Enables virtual fields (including `id`)
            transform: function (doc, ret) {
                ret.id = ret._id;     // Set `id` field to the value of `_id`
                delete ret._id;       // Remove `_id` field from the JSON response
                delete ret.__v;       // Optionally remove the __v field (versionKey)
            }
        }
    });

export const MngItem = mongoose.model('Item', ItemSchema);

