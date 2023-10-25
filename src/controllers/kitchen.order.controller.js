import KitchenOrder from '../models/KitchenOrder'
import Order from '../models/Order'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'

import mongoose from 'mongoose'

export const findAllKitchenOrders = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await KitchenOrder.paginate(condition, {
      offset,
      limit,
      name,
      populate: [
        {
          path: 'orders',
          select: 'user _id orderNum active price comments',
        },
      ],
    })

    res.json({
      totalItems: data.totalDocs,
      kitchenOrders: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createKitchenOrder = async (req, res, next) => {
  // valido vengan datos
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Kitchen order name is required',
    })
  }
  if (!req.body.orders) {
    return res.status(400).send({
      error_message: 'Kitchen order name is required',
    })
  }

  const validOrders = req.body.orders.filter((id) => mongoose.Types.ObjectId.isValid(id))

  const orderExist = await Order.find({
    _id: { $in: validOrders },
  })

  if (orderExist.length !== req.body.orders.length) {
    return res.status(400).send({
      error_message: 'Some orders not exists.',
    })
  }

  // quiero guardar una orden
  try {
    const count = await setCounter('KitchenOrder')

    const newOrder = new KitchenOrder({
      orderNum: count,
      name: req.body.name,
      orders: req.body.orders,
      comments: req.body.comments,
      cooked: false,
      active: req.body.active ? req.body.active : true,
    })

    await newOrder
      .save()
      .then((result) => {
        console.log(`Kitchen order with id ${result._id} was created.`)
        res.json({ result })
      })
      .catch((err) => {
        throw err
      })
  } catch (err) {
    next(err)
  }
}

export const findOneKitchenOrder = async (req, res, next) => {
  const { id } = req.params

  try {
    const order = await KitchenOrder.findById(id).populate({
      path: 'orders',
      select: 'user _id active orderNum price comments',
    })
    if (!order) {
      return res.status(404).json({
        error_message: `The kitchen order with id ${id} does not exists.`,
      })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveKitchenOrders = async (req, res, next) => {
  try {
    const activeOrders = await KitchenOrder.find({ active: true })
    res.json({ activeOrders })
  } catch (err) {
    next(err)
  }
  // await KitchenOrder.find({ used: true })
  //   .then((result) => {
  //     res.json(result);
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
}

export const updateKitchenOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const updateOrder = await KitchenOrder.findByIdAndUpdate(id, req.body)

    if (!updateOrder) {
      return res.status(404).json({
        error_message: `Kitchen order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Kitchen order ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteKitchenOrder = async (req, res, next) => {
  const { id } = req.params
  try {
    const deleteOrder = await KitchenOrder.findByIdAndDelete(id)
    if (!deleteOrder) {
      return res.status(404).json({
        error_message: `Kitchen order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Kitchen order with id ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
