import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const kitchenOrderSchema = new Schema(
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
    deliveryOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryOrder',
      },
    ],
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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
);

kitchenOrderSchema.plugin(mongoosePaginate);

export default model('KitchenOrder', kitchenOrderSchema);
