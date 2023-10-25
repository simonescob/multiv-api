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
      require: true,
      trim: true,
      maxlenght: 100,
    },
    comments: {
      type: String,
      require: false,
      trim: true,
      maxlenght: 100,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
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
)

menuSchema.plugin(mongoosePaginate)

export default model('Menu', menuSchema)
