import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    coupons: {
      type: Number,
      maxlength: 3
    },
    medical: {
      type: Boolean,
      default: false
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      }
    ],
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

userSchema.plugin(mongoosePaginate);

export default model('User', userSchema);
