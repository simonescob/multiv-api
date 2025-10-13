import Order from '../models/Order'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { orderSchema } from '../libs/validation/yupSchemas'
import Product from '../models/Product'
import User from '../models/User'

export const findAllOrders = async (req, res, next) => {
  try {
    const { size, page, search, isActive } = req.query
    const orderNum = search ? parseInt(search) : undefined
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined

    const condition = {
      ...(orderNum !== undefined && !isNaN(orderNum) && { orderNum }),
      deletedAt: null,
      ...(isActiveBool !== undefined && { active: isActiveBool }),
    }

    const { limit, offset } = getPagination(page, size)

    const data = await Order.paginate(condition, {
      offset,
      limit,
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'product',
          select: 'name _id productNum active price',
        },
        {
          path: 'user',
          select: 'username _id name lastname',
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
  const { product, user, comments, price, deliveryDate, cookDate, delivered, delivering, cooked, cooking } = req.body

  try {
    await orderSchema.validate(req.body, { abortEarly: true })

    const count = await setCounter('Order')

    const newOrderData = new Order({
      orderNum: count,
      user,
      product,
      price,
      comments,
      deliveryDate,
      cookDate,
      delivered,
      delivering,
      cooked,
      cooking,
      active: req.body.active ? req.body.active : true,
      deleteAt: null,
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
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
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

export const sendToTrashOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const order = await Order.findById(id)

    const newDeletedState = order.deletedAt ? null : new Date()

    const updateOrder = await Order.findByIdAndUpdate(id, { deletedAt: newDeletedState })

    if (!updateOrder) {
      return res.status(404).json({
        error_message: `The order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Order ${id} send to trash.`,
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

export const deleteAllOrders = async (req, res, next) => {
  try {
    await Order.deleteMany({})
    res.status(200).send({ message: 'All orders was deleted.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Error trying delete all orders.' })

    next()
  }
}

export const createMultipleOrders = async (req, res, next) => {
  const ordersData = req.body;

  try {
    const createdOrders = [];

    for (const orderData of ordersData) {
      const { lunch, dinner } = orderData;

      // Create orders for lunch
      for (let i = 0; i < lunch.quantity; i++) {
        const newOrder = new Order({
          product: lunch._id,
          quantity: 1, // Assuming each order represents one quantity
          active: true,
          deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
          // Add other necessary fields here
        });
        createdOrders.push(await newOrder.save());
      }

      // Create orders for dinner
      for (let i = 0; i < dinner.quantity; i++) {
        const newOrder = new Order({
          product: dinner._id,
          quantity: 1, // Assuming each order represents one quantity
          active: true,
          deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
          // Add other necessary fields here
        });
        createdOrders.push(await newOrder.save());
      }
    }

    res.status(201).json({ createdOrders });
  } catch (error) {
    console.error('Error creating orders:', error);
    res.status(400).json({ error: 'Error creating orders', details: error });
  }
}

export const findOrdersByText = async (req, res, next) => {
  try {
    const { size, page, search, isActive } = req.query
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined

    // If no search provided, fallback to the general list behavior
    if (!search || search.trim() === '') {
      return findAllOrders(req, res, next)
    }

    const { limit, offset } = getPagination(page, size)
    const regex = new RegExp(search, 'i')

    const orConditions = []

    // numeric orderNum match
    const orderNum = parseInt(search)
    if (!isNaN(orderNum)) {
      orConditions.push({ orderNum })
    }

    // comments partial match
    orConditions.push({ comments: { $regex: regex } })

    // find products matching name, excluding "carne" case-insensitively
    const matchedProducts = await Product.find({
      $and: [
        { name: { $regex: regex } },
      ],
      deletedAt: null
    }).select('_id')
    if (matchedProducts && matchedProducts.length) {
      const productIds = matchedProducts.map((p) => p._id)
      orConditions.push({ product: { $in: productIds } })
    }

    // find users matching username, name or lastname
    const matchedUsers = await User.find({
      $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }, { lastname: { $regex: regex } }],
    }).select('_id')
    if (matchedUsers && matchedUsers.length) {
      const userIds = matchedUsers.map((u) => u._id)
      orConditions.push({ user: { $in: userIds } })
    }

    const condition = {
      deletedAt: null,
      ...(isActiveBool !== undefined && { active: isActiveBool }),
      ...(orConditions.length && { $or: orConditions }),
    }

    const data = await Order.paginate(condition, {
      offset,
      limit,
      populate: [
        {
          path: 'product',
          select: 'name _id productNum active price',
        },
        {
          path: 'user',
          select: 'username _id name lastname',
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


