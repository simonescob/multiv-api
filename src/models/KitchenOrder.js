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
      trim: true,
      maxlength: 100,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready_for_delivery', 'delivered'],
      default: 'pending',
    },
    preparationDate: {
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

kitchenOrderSchema.plugin(mongoosePaginate)

export default model('KitchenOrder', kitchenOrderSchema)
