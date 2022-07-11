import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const viandaSchema = new Schema(
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
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
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

viandaSchema.plugin(mongoosePaginate);

export default model('Vianda', viandaSchema);
