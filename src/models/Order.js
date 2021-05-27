import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    user: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);

export default model('Order', orderSchema);
