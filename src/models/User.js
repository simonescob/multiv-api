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
    phone: {
      type: String,
      required: false,
      trim: true,
      maxlength: 16,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
    },
    direction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    location: [
      {
        type: Number,
      },
      {
        type: Number,
      },
    ],
    age: {
      type: Number,
      required: true,
      maxlength: 3,
    },
    medical: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
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

userSchema.plugin(mongoosePaginate);

export default model('User', userSchema);
