const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxLength: [100, 'Name can not be more than 100 character'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxLength: [1000, 'Description can not be more than 1000 character'],
    },
    image: { type: String, default: '/uploads/example.jpeg' },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: { type: [String], require: true },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: { type: Number, require: true, default: 15 },
    averageRating: { type: Number, default: 0 },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
