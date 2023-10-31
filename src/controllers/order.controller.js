import Order from '../models/Order'
import User from '../models/User'
import Product from '../models/Product'
import mongoose from 'mongoose'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'

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
  // valido vengan datos

  if (!req.body.user) {
    return res.status(400).send({
      error_message: 'User is required',
    })
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
    return res.status(400).send({
      error_message: 'User not exists',
    })
  }

  const userExist = await User.findById(req.body.user)

  if (!userExist) {
    return res.status(400).send({
      error_message: 'User not exists',
    })
  }

  if (!req.body.product) {
    return res.status(400).send({
      error_message: 'Product is required',
    })
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.product)) {
    return res.status(400).send({
      error_message: 'Product not exists',
    })
  }

  const productExist = await Product.findById(req.body.product)

  if (!productExist) {
    return res.status(400).send({
      error_message: 'Product not exists',
    })
  }

  if (!req.body.price) {
    return res.status(400).send({
      error_message: 'Order price is required',
    })
  }

  // quiero guardar una orden
  try {
    const count = await setCounter('Order')
    const newOrder = new Order({
      orderNum: count,
      user: req.body.user,
      product: req.body.product,
      price: req.body.price,
      comments: req.body.comments,
    })

    await newOrder
      .save()
      .then((result) => {
        console.log(`Order with id ${result._id} was created.`)
        res.json({ result })
      })
      .catch((err) => {
        console.error(err)
      })
  } catch (err) {
    next(err)
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
