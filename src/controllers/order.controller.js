import Order from '../models/Order'
import User from '../models/User'
import Product from '../models/Product'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import Boom from '@hapi/boom'
import { orderSchema, orderObjectIdSchema } from '../libs/validation/yupSchemas'

export const findAllOrders = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await Order.paginate(condition, {
      offset,
      limit,
      name,
      populate: [
        {
          path: 'product',
          select: 'name _id productNum active price',
        },
        {
          path: 'user',
          select: 'username _id role',
        },
      ],
    })

    res.json({
      totalItems: data.totalDocs,
      orders: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createOrder = async (req, res, next) => {
  const { product, user, comments, price, deliveryDate } = req.body

  try {
    await orderSchema.validate(req.body, { abortEarly: false })
    await orderObjectIdSchema.validate({ user, product }, { abortEarly: false })

    if (user) {
      const userExists = await User.findById(user)
      if (!userExists) {
        throw Boom.notFound('El usuario no existe')
      }
    }

    if (product) {
      const productExists = await Product.findById(product)
      if (!productExists) {
        throw Boom.notFound('El producto no existe')
      }
    }

    const count = await setCounter('Order')

    const newOrderData = new Order({
      orderNum: count,
      user,
      product,
      price,
      comments,
      deliveryDate,
    })

    if (user && user.trim() !== '') {
      newOrderData.user = user
    }
    if (product && product.trim() !== '') {
      newOrderData.product = product
    }

    const newOrder = new Order(newOrderData)

    const result = await newOrder.save()
    res.status(201).json({ result })
  } catch (error) {
    console.log(error)
    if (error.isBoom) {
      res.status(error.output.statusCode).json(error.output.payload)
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    } else {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}

export const findOneOrder = async (req, res, next) => {
  const { id } = req.params

  try {
    const order = await Order.findById(id)
      .populate({
        path: 'product',
        select: 'name _id productNum active', // Poblar solo los campos 'name' y '_id' del documento 'product'
      })
      .populate({
        path: 'user',
        select: 'username _id role', // Poblar solo los campos 'name' y '_id' del documento 'product'
      })
    if (!order) {
      return res.status(404).json({
        error_message: `The order with id ${id} does not exists.`,
      })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveOrders = async (req, res, next) => {
  try {
    const activeOrders = await Order.find({ active: true })
    res.json({ activeOrders })
  } catch (err) {
    next(err)
  }
  await Order.find({ used: true })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      throw err
    })
}

export const updateOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const updateOrder = await Order.findByIdAndUpdate(id, req.body)

    if (!updateOrder) {
      return res.status(404).json({
        error_message: `The order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Order ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteOrder = async (req, res, next) => {
  const { id } = req.params
  try {
    const deleteOrder = await Order.findByIdAndDelete(id)
    if (!deleteOrder) {
      return res.status(404).json({
        error_message: `Order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Order with id ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
