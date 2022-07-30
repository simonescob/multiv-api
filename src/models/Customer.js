import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 16,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    address: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    age: {
      type: Number,
      maxlength: 3,
    },
    cupons: {
      type: Number,
      required: true,
      maxlength: 3,
    },
    active: {
      type: Boolean,
      default: true,
    },  
    inTrash: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

customerSchema.plugin(mongoosePaginate);

export default model('Customer', customerSchema);
