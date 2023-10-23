import DeliveryOrder from '../models/DeliveryOrder'
import { getPagination } from '../libs/getPagination'

export const findAllDeliveryOrders = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await DeliveryOrder.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'product',
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

export const createDeliveryOrder = async (req, res, next) => {
  // valido vengan datos
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Delivery order name is required',
    })
  }

  if (!req.body.user) {
    return res.status(400).send({
      error_message: 'User is required',
    })
  }

  if (!req.body.products) {
    return res.status(400).send({
      error_message: 'Products are required',
    })
  }

  // quiero guardar una orden
  try {
    const newDeliveryOrder = new DeliveryOrder({
      name: req.body.name,
      user: req.body.user,
      products: req.body.products,
      comments: req.body.comments,
      arrival_date: req.body.arrival_date,
      active: req.body.active ? req.body.active : true,
    })

    await newDeliveryOrder
      .save()
      .then((result) => {
        console.log(`Delivery order with id ${result._id} was created.`)
        res.json({ result })
      })
      .catch((err) => {
        throw err
      })
  } catch (err) {
    next(err)
  }
}

export const findOneDeliveryOrder = async (req, res, next) => {
  const { id } = req.params

  try {
    const order = await DeliveryOrder.findById(id).populate('product').populate('user')
    if (!order) {
      return res.status(404).json({
        error_message: `The delivery order with id ${id} does not exists.`,
      })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveDeliveryOrders = async (req, res, next) => {
  try {
    const activeOrders = await DeliveryOrder.find({ active: true })
    res.json({ activeOrders })
  } catch (err) {
    next(err)
  }
  // await DeliveryOrder.find({ used: true })
  //   .then((result) => {
  //     res.json(result);
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
}

export const updateDeliveryOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const updateOrder = await DeliveryOrder.findByIdAndUpdate(id, req.body)

    if (!updateOrder) {
      return res.status(404).json({
        error_message: `The delivery order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Delivery order ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteDeliveryOrder = async (req, res, next) => {
  const { id } = req.params
  try {
    const deleteOrder = await DeliveryOrder.findByIdAndDelete(id)
    if (!deleteOrder) {
      return res.status(404).json({
        error_message: `The delivery order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Delivery order with id ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
