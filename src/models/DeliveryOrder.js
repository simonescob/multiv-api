import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const deliveryOrderSchema = new Schema(
  {
    deliveryOrderNum: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 10,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    comments: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    delivering: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: Date,
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

deliveryOrderSchema.plugin(mongoosePaginate)

export default model('DeliveryOrder', deliveryOrderSchema)
