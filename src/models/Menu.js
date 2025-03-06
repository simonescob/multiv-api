import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const menuSchema = new Schema(
  {
    menuNum: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 10,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comments: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    lunch: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    dinner: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

menuSchema.plugin(mongoosePaginate)

export default model('Menu', menuSchema)
