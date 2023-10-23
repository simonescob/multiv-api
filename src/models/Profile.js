import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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
      required: true,
      trim: true,
      maxlength: 30,
    },
    direction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    location: {
      type: [Number],
      required: false,
      trim: true,
      maxlength: 30,
    },
    birth: {
      type: Date,
      required: false,
      trim: true,
      min: '1910-01-01',
      max: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

profileSchema.plugin(mongoosePaginate);

export default model('Profile', profileSchema);
