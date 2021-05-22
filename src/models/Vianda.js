import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const viandaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

viandaSchema.plugin(mongoosePaginate);


export default model('Vianda', viandaSchema);
