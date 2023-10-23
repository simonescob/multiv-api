import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const menuSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      maxlenght: 100,
    },
    description: {
      type: String,
      require: true,
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
