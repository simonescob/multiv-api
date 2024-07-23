import DeliveryOrder from '../models/DeliveryOrder'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { deliveryOrderSchema } from '../libs/validation/yupSchemas'

export const findAllDeliveryOrders = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = {
      ...(name && { name: { $regex: new RegExp(name), $options: 'i' } }),
      deletedAt: null,
    }

    const { limit, offset } = getPagination(page, size)

    const data = await DeliveryOrder.paginate(condition, {
      offset,
      limit,
      name,
      populate: [
        {
          path: 'orders',
          select: 'user orderNum _id active price comments product',
          populate: [
            {
              path: 'user',
              select: 'username name lastname',
            },
            {
              path: 'product',
              select: 'name', // Incluir el campo 'name' del usuario
            },
          ],
        },
        {
          path: 'user',
          select: 'username name lastname _id',
        },
      ],
    })

    res.json({
      totalItems: data.totalDocs,
      deliveryOrders: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createDeliveryOrder = async (req, res, next) => {
  try {
    await deliveryOrderSchema.validate(req.body, { abortEarly: true })
    const count = await setCounter('DeliveryOrder')

    const newDeliveryOrderData = new DeliveryOrder({
      deliveryOrderNum: count,
      name: req.body.name,
      user: req.body.user,
      orders: req.body.orders,
      comments: req.body.comments,
      address: req.body.address,
      delivered: false,
      delivering: false,
      deliveryDate: req.body.deliveryDate || new Date(),

      active: req.body.active ? req.body.active : true,
      deletedAt: null,
    })
    const newDeliveryOrder = new DeliveryOrder(newDeliveryOrderData)

    const result = await newDeliveryOrder.save()
    res.status(201).json({ result })

    // console.log('Validación exitosa')
  } catch (error) {
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    next(error)
  }
}

export const findOneDeliveryOrder = async (req, res, next) => {
  const { id } = req.params

  try {
    const order = await DeliveryOrder.findById(id)
      .populate({
        path: 'orders',
        select: 'user _id orderNum active price comments product',
        populate: [
          {
            path: 'user',
            select: 'username name lastname',
          },
          {
            path: 'product',
            select: 'name', // Incluir el campo 'name' del usuario
          },
        ],
      })
      .populate({
        path: 'user',
        select: 'username _id role',
      })

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

export const deleteAllDeliveryOrders = async (req, res, next) => {
  try {
    await DeliveryOrder.deleteMany({})
    res.status(200).send({ message: 'All delivery orders was deleted.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Error trying delete all orders.' })

    next()
  }
}

export const sendToTrashDeliveryOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const deliveryOrder = await DeliveryOrder.findById(id)

    const newDeletedState = deliveryOrder.deletedAt ? null : new Date()

    const updateDeliveryOrder = await DeliveryOrder.findByIdAndUpdate(id, { deletedAt: newDeletedState })

    if (!updateDeliveryOrder) {
      return res.status(404).json({
        error_message: `The delivery order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `The delivery order ${id} send to trash.`,
    })
  } catch (err) {
    next(err)
  }
}
