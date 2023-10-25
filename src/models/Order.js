import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const orderSchema = new Schema(
  {
    orderNum: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 10,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 60,
    },
    comments: {
      type: String,
      required: false,
      trim: true,
      maxlength: 140,
    },
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

orderSchema.plugin(mongoosePaginate)

export default model('Order', orderSchema)
