import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const kitchenOrderSchema = new Schema(
  {
    kitchenOrderNum: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 10,
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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cooked: {
      type: Boolean,
      default: false,
    },
    cooking: {
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
