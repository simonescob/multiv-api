import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 60,
    },
    ingredients: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredients',
          required: true,
          trim: true,
          maxlength: 100,
        },
        gms: {
          type: Number,
          required: true,
          trim: true,
          maxlength: 8,
        }
      }
    ],
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

productSchema.plugin(mongoosePaginate);

export default model('Product', productSchema);
