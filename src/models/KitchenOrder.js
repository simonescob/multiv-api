import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const kitchenOrderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    cooked: {
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

kitchenOrderSchema.plugin(mongoosePaginate)

export default model('KitchenOrder', kitchenOrderSchema)
