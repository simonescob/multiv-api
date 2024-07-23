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
    deliveryDate: {
      type: Date,
    },
    cookDate: {
      type: Date,
    },
    cooked: {
      type: Boolean,
      default: false,
    },
    cooking: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    delivering: {
      type: Boolean,
      default: false,
    },
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

orderSchema.plugin(mongoosePaginate)

export default model('Order', orderSchema)
