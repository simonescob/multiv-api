import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)
ingredientSchema.plugin(mongoosePaginate);


export default model('Ingredient', ingredientSchema);
