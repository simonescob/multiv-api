import * as yup from 'yup'
import mongoose from 'mongoose'

// Función de validación para ObjectID
export const objectIdValidation = (campo) => {
  yup.string().test('is-mongodb-objectid', `${campo} no es un ObjectID válido de MongoDB`, (value) => mongoose.Types.ObjectId.isValid(value))
}

export const orderSchema = yup.object().shape({
  user: yup.string().required('Usuario es requerido'),
  product: yup.string().required('Producto es requerido'),
  price: yup.number('Precio no válido').max(999999, 'Precio demasiado elevado').positive('La cantidad debe ser positiva'),
  comments: yup.string().max(140, 'Comentarios de no más de 140 caracteres'),
  deliveryDate: yup.date('La fecha del pedido no es válida').required('La fecha del pedido es requerida'),
})

export const orderObjectIdSchema = yup.object().shape({
  user: objectIdValidation('User'),
  product: objectIdValidation('Product'),
})
