import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    imgUrl: {
      type: String,
      // required: true,
      trim: true,
      maxlength: 200
    },
    active: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      trim: true,
      maxlength: 10
    },
    stock: {
      type: Number,
      trim: true,
      maxlength: 10
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
)
ingredientSchema.plugin(mongoosePaginate);


export default model('Ingredient', ingredientSchema);
