import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    address: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
    },
    location: {
      type: [Number],
      required: false,
      maxlength: 2,
    },
    birth: {
      type: Date,
      required: false,
      trim: true,
      min: '1910-01-01',
      max: Date.now,
    },
    hashedPassword: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      default: 'customer',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

userSchema.plugin(mongoosePaginate)

export default model('User', userSchema)
