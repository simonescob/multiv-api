import { Schema, model } from 'mongoose'

const counterSchema = new Schema({
  modelName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  count: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 10,
  },
})

const Counter = model('Counter', counterSchema)

export default Counter
