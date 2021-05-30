import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const planSchema = new Schema(
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
    changes: {
      type: Number,
      maxlength: 2
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

planSchema.plugin(mongoosePaginate);

export default model('Plan', planSchema);
