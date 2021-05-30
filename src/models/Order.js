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
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    arrival_date: {
      type: Date
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);

export default model('Order', orderSchema);
