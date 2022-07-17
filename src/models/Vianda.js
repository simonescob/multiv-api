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
        _id: {
          type: Schema.Types.ObjectId,
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

viandaSchema.plugin(mongoosePaginate);

export default model('Vianda', viandaSchema);
