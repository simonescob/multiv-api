import KitchenOrder from '../models/KitchenOrder'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { kitchenOrderSchema } from '../libs/validation/yupSchemas'

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
          select: 'user _id orderNum active price comments product',
          populate: [
            {
              path: 'user',
              select: 'name lastname username', // Incluir el campo 'name' del usuario
            },
            {
              path: 'product',
              select: 'name', // Incluir el campo 'name' del usuario
            },
          ],
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
  try {
    await kitchenOrderSchema.validate(req.body, { abortEarly: true })

    const count = await setCounter('KitchenOrder')

    const newKitchenOrderData = new KitchenOrder({
      kitchenOrderNum: count,
      // name: req.body.name,
      orders: req.body.orders,
      user: req.body.user,
      comments: req.body.comments,
      cooked: false,
      cooking: false,
      active: req.body.active ? req.body.active : true,
    })

    const newKitchenOrder = new KitchenOrder(newKitchenOrderData)

    const result = await newKitchenOrder.save()
    res.status(201).json({ result })
  } catch (error) {
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    next(error)
  }
}

export const findOneKitchenOrder = async (req, res, next) => {
  const { id } = req.params

  try {
    const order = await KitchenOrder.findById(id).populate({
      path: 'orders',
      select: 'user _id active orderNum price comments',
      populate: {
        path: 'user',
        select: 'username name lastname',
      },
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
