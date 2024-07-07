import * as yup from 'yup'
import mongoose from 'mongoose'
import Order from '../../models/Order'
import Product from '../../models/Product'
import User from '../../models/User'
import Ingredient from '../../models/Ingredient'

const objectIdArrayExistsValidation = (campo, model) => {
  return yup.array().of(
    yup
      .string()
      .required(`${campo} es requerido`)
      .test('is-mongodb-objectid', `${campo} contiene ObjectIDs no válidos de MongoDB`, (value) => mongoose.Types.ObjectId.isValid(value))
      .test('is-model-exists', ``, async function (value) {
        const { path, createError } = this

        const exists = await model.exists({ _id: value })
        if (!exists) {
          return createError({ path, message: `El ${campo} con id ${value} no existe` })
        }
        return true
      })
  )
}
const objectIdIngredientsArrayExistsValidation = (campo, model) => {
  return yup.array().of(
    yup.object().shape({
      ingredient: yup
        .string()
        .required(`${campo} es requerido`)
        .test('is-mongodb-objectid', `${campo} contiene ObjectIDs no válidos de MongoDB`, (value) => mongoose.Types.ObjectId.isValid(value))
        .test('is-model-exists', ``, async function (value) {
          const { path, createError } = this

          const exists = await model.exists({ _id: value })
          if (!exists) {
            return createError({ path, message: `El ${campo} con id ${value} no existe` })
          }
          return true
        }),
      gms: yup.number().positive().required(),
    })
  )
}

const objectIdExistsValidation = (campo, model) => {
  return yup
    .string()
    .required(`${campo} es requerido`)
    .test('is-mongodb-objectid', `${campo} no es un ObjectID válido de MongoDB`, (value) => mongoose.Types.ObjectId.isValid(value))
    .test('is-model-exists', ``, async function (value) {
      const { path, createError } = this
      const exists = await model.exists({ _id: value })
      if (!exists) {
        return createError({ path, message: `El ${campo} con id ${value} no existe` })
      }
      return true
    })
}

export const orderSchema = yup.object().shape({
  price: yup.number('Precio no válido').max(999999, 'Precio demasiado elevado').positive('La cantidad debe ser positiva'),
  comments: yup.string().max(140, 'Comentarios de no más de 140 caracteres'),
  user: objectIdExistsValidation('usuario', User),
  product: objectIdExistsValidation('producto', Product),

  deliveryDate: yup.date('La fecha del pedido no es válida').required('La fecha del pedido es requerida'),
})
export const kitchenOrderSchema = yup.object().shape({
  orders: objectIdArrayExistsValidation('pedido', Order),
  comments: yup.string().required().trim().max(100),
  cooked: yup.boolean().default(false),
  inProcess: yup.boolean().default(false),
  active: yup.boolean().default(true),
})
export const deliveryOrderSchema = yup.object().shape({
  name: yup.string().required('Nombre  requerido'),
  user: objectIdExistsValidation('usuario', User),
  orders: objectIdArrayExistsValidation('pedido', Order),
  address: yup.string().required().trim().max(100),
  comments: yup.string().required().trim().max(100),
  delivered: yup.boolean().default(false),
  going: yup.boolean().default(false),
  active: yup.boolean().default(true),
})

export const ingredientSchema = yup.object().shape({
  name: yup.string().required('Nombre es requerido'),
})
export const productSchema = yup.object().shape({
  name: yup.string().required('Nombre requerido'),
  price: yup.number('Precio no válido').max(999999, 'Precio demasiado elevado').positive('La cantidad debe ser positiva').required('Precio es requerido'),
  description: yup.string().max(140, 'Descripción no puede superar 140 caracteres'),
  ingredients: objectIdIngredientsArrayExistsValidation('ingrediente', Ingredient),
})
