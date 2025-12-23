import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const deliveryOrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    address: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    orders: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: ['to_delivery', 'delivered', 'delivering', 'not_delivered'],
      default: 'to_delivery',
    },
    deliveryDate: {
      type: Date,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

deliveryOrderSchema.plugin(mongoosePaginate)

export default model('DeliveryOrder', deliveryOrderSchema)
