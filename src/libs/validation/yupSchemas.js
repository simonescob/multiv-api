import * as yup from 'yup'
import mongoose from 'mongoose'
import Order from '../../models/Order'
import Product from '../../models/Product'
import User from '../../models/User'
import Ingredient from '../../models/Ingredient'
import { checkPasswordPwned } from './checkPasswordPwned'

yup.addMethod(yup.string, 'pwned', function (message) {
  return this.test('pwned', message, async function (value) {
    const { path, createError } = this
    if (!value) return true
    const isPwned = await checkPasswordPwned(value)
    return isPwned ? createError({ path, message }) : true
  })
})

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
  user: objectIdExistsValidation('usuario', User).required(`Usuario requerido`),
  product: objectIdExistsValidation('producto', Product).required('Producto requerido'),

  deliveryDate: yup.date('La fecha del pedido no es válida').required('La fecha del pedido es requerida'),
})
export const kitchenOrderSchema = yup.object().shape({
  orders: objectIdArrayExistsValidation('pedido', Order),
  comments: yup.string().required().trim().max(100),
  cooked: yup.boolean().default(false),
  cooking: yup.boolean().default(false),
  user: objectIdExistsValidation('usuario', User),
  active: yup.boolean().default(true),
})
export const menuSchema = yup.object().shape({
  name: yup.string().required('Nombre requerido'),
  products: objectIdArrayExistsValidation('producto', Product),
  comments: yup.string().required().trim().max(100),
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

export const userSchema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, 'El nombre de usuario solo puede contener letras y números')
    .min(6, 'Nombre de usuario de más de 6 caracteres')
    .max(16, 'Nombre de usuario de no más de 16 caracteres')
    .required('Nombre de usuario requerido')
    .test('is-unique', 'El nombre de usuario ya está en uso', async (value) => {
      const user = await User.findOne({ username: value })
      return !user
    }),
  password: yup.string().min(6, 'Contraseña de más de 6 caracteres').required('Contraseña requerida').pwned('Contraseña no segura'),
  name: yup.string().required('Nombre es requerido').max(60, 'Nombre no puede superar 60 caracteres'),
  lastname: yup.string().required('Apellido es requerido').max(60, 'Apellido no puede superar 60 caracteres'),
  email: yup
    .string()
    .email('No es un email válido')
    .max(60, 'Email no puede superar 60 caracteres')
    .test('is-unique', 'El email ya está en uso', async (value) => {
      const user = await User.findOne({ email: value })
      return !user
    }),
  phone: yup.string().required('Teléfono es requerido').max(30, 'Teléfono no puede superar 30 caracteres'),
  address: yup.string().max(60, 'Dirección no puede superar 60 caracteres'),
  birth: yup.date('Fecha de nacimiento debe ser una fecha válida'),
  location: yup.array().of(yup.number().typeError('Las coordenadas deben ser númericas').required('Coordenadas requeridas')).length(2, 'Location debe tener 2 elementos de coordenadas'),
  role: yup.string().oneOf(['admin', 'customer', 'kitchen', 'delivery'], 'El rol no es correcto'),
})

export const productSchema = yup.object().shape({
  name: yup.string().required('Nombre requerido'),
  price: yup.number('Precio no válido').max(999999, 'Precio demasiado elevado').positive('La cantidad debe ser positiva').required('Precio es requerido'),
  description: yup.string().max(140, 'Descripción no puede superar 140 caracteres'),
  ingredients: objectIdIngredientsArrayExistsValidation('ingrediente', Ingredient),
})
