import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const deliveryOrderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    arrival_date: {
      type: Date,
    },
    delivered: {
      type: Boolean,
      default: false,
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

deliveryOrderSchema.plugin(mongoosePaginate)

export default model('DeliveryOrder', deliveryOrderSchema)
