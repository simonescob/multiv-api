import Product from '../models/Product'
import Order from '../models/Order'

import KitchenOrder from '../models/KitchenOrder'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { kitchenOrderSchema } from '../libs/validation/yupSchemas'

export const findAllKitchenOrders = async (req, res, next) => {
  try {
    const { size, page, search, isActive } = req.query
    const kitchenOrderNum = search ? parseInt(search) : undefined
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined

    const condition = {
      ...(kitchenOrderNum !== undefined && !isNaN(kitchenOrderNum) && { kitchenOrderNum }),
      deletedAt: null,
      ...(isActiveBool !== undefined && { active: isActiveBool }),
    }

    const { limit, offset } = getPagination(page, size)

    const data = await KitchenOrder.paginate(condition, {
      offset,
      limit,
      sort: { createdAt: -1 }, // Add this line to sort by createdAt in descending order

      populate: [
        {
          path: 'orders',
          select: 'user _id orderNum active price comments product deliveryDate cooking cooked',
          populate: [
            {
              path: 'user',
              select: 'name lastname username', // Incluir el campo 'name' del usuario
            },
            {
              path: 'product',
              select: 'name active', // Incluir el campo 'name' del usuario
            },
          ],
        },
        {
          path: 'user',
          select: 'name lastname username', // Incluir el campo 'name' del usuario
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

    // Check if any orders are already assigned to a kitchen order
    const existingAssignments = await KitchenOrder.find({ orders: { $in: req.body.orders } })
    if (existingAssignments.length > 0) {
      return res.status(400).json({ error: 'Algunos pedidos ya están asignados a una orden de cocina.' })
    }

    const count = await setCounter('KitchenOrder')

    const newKitchenOrderData = new KitchenOrder({
      kitchenOrderNum: count,
      // name: req.body.name,
      orders: req.body.orders,
      user: req.body.user,
      comments: req.body.comments,
      cooked: false,
      cooking: false,
      preparationDate: req.body.preparationDate || new Date(),
      active: req.body.active ? req.body.active : true,
      deletedAt: null,
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
    const order = await KitchenOrder.findById(id)
      .populate({
        path: 'orders',
        select: 'user _id active orderNum price comments product cooked cooking',
        populate: [
          {
            path: 'user',
            select: 'username name lastname',
          },
          {
            path: 'product',
            select: 'name ingredients',
            populate: {
              path: 'ingredients.ingredient',
              select: 'name',
            },
          },
        ],
      })
      .populate({
        path: 'user',
        select: 'username name lastname',
      })
    if (!order) {
      return res.status(404).json({
        error_message: `La orden de cocina con id ${id} no existe.`,
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
    // If updating orders, check for conflicts
    if (req.body.orders) {
      const existingAssignments = await KitchenOrder.find({
        _id: { $ne: id },
        orders: { $in: req.body.orders }
      })
      if (existingAssignments.length > 0) {
        return res.status(400).json({ error: 'Algunos pedidos ya están asignados a otra orden de cocina.' })
      }
    }

    const updateOrder = await KitchenOrder.findByIdAndUpdate(id, req.body)

    if (!updateOrder) {
      return res.status(404).json({
        error_message: `La orden de cocina con id ${id} no existe.`,
      })
    }
    res.json({
      message: `Orden de cocina ${id} actualizada.`,
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
        error_message: `La orden de cocina con id ${id} no existe.`,
      })
    }
    res.json({
      message: `La orden de cocina con id ${id} fue eliminada.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteAllKitchenOrders = async (req, res, next) => {
  try {
    await KitchenOrder.deleteMany({})
    res.status(200).send({ message: 'Todas las órdenes de cocina fueron eliminadas.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Error al intentar eliminar todas las órdenes.' })

    next()
  }
}

export const sendToTrashKitchenOrder = async (req, res, next) => {
  const id = req.params.id
  try {
    const kitchenOrder = await KitchenOrder.findById(id)

    const newDeletedState = kitchenOrder.deletedAt ? null : new Date()

    const updateKitchenOrder = await KitchenOrder.findByIdAndUpdate(id, { deletedAt: newDeletedState })

    if (!updateKitchenOrder) {
      return res.status(404).json({
        error_message: `La orden de cocina con id ${id} no existe.`,
      })
    }
    res.json({
      message: `La orden de cocina ${id} fue enviada a la papelera.`,
    })
  } catch (err) {
    next(err)
  }
}

export const KitchenOrdersByUser = async (req, res, next) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter
  let { startDate, endDate, range } = req.query; // Get startDate, endDate, and range from query parameters

  try {
    // Check if the user exists
    const userExists = await KitchenOrder.findOne({ user: userId });
    
    if (!userExists) {
      return res.status(404).json({
        error_message: `El usuario con id ${userId} no existe.`,
      });
    }

    const dateCondition = {};
    const now = new Date();

    if (range) {
      switch (range) {
        case '1_day':
          startDate = new Date(now.setDate(now.getDate() - 1)).toISOString();
          endDate = new Date().toISOString();
          break;
        case '3_days':
          startDate = new Date(now.setDate(now.getDate() - 3)).toISOString();
          endDate = new Date().toISOString();
          break;
        case '1_week':
          startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
          endDate = new Date().toISOString();
          break;
        case '1_month':
          startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
          endDate = new Date().toISOString();
          break;
        default:
          // If range is provided but not recognized, do nothing or handle as error
          break;
      }
    }

    if (startDate) {
      dateCondition.$gte = new Date(startDate);
    }
    if (endDate) {
      dateCondition.$lte = new Date(endDate);
    }

    const queryCondition = { user: userId };
    if (Object.keys(dateCondition).length > 0) {
      queryCondition.preparationDate = dateCondition;
    }

    const kitchenOrders = await KitchenOrder.find(queryCondition)
    .populate({
      path: 'user',
      select: 'username name lastname', // Populate user details
    })
    .populate({
      path: 'orders',
      populate: {
        path: 'product',
        select: 'name', // Include the name of the product
      },
    });

    if (!kitchenOrders.length) {
      return res.status(404).json({
        error_message: `El usuario con id ${userId} existe, pero no tiene órdenes de cocina para el rango de fechas especificado.`,
      });
    }

    res.json(kitchenOrders);
  } catch (err) {
    next(err);
  }
}

/**
 * Return flattened orders assigned to a kitchen user (no date filtering).
 * Each item: { _id, cooked, active, product: { _id, name, active } }
 */
export const getOrdersAssignedToUserSimple = async (userId, kitchenOrderId = null) => {
  const populateConfig = {
    path: 'orders',
    select: 'cooked active _id product',
    populate: {
      path: 'product',
      select: 'name active',
    },
  }

  let kitchenOrders
  if (kitchenOrderId) {
    const ko = await KitchenOrder.findOne({ _id: kitchenOrderId, user: userId }).populate(populateConfig)
    kitchenOrders = ko ? [ko] : []
  } else {
    kitchenOrders = await KitchenOrder.find({ user: userId }).populate(populateConfig)
  }

  const options = kitchenOrders.flatMap((ko) =>
    (ko.orders || []).map((o) => ({
      value: o.product ? o.product._id : o._id,
      name: o.product ? o.product.name : (o._id && o._id.toString ? o._id.toString() : o._id),
      cooked: o.cooked,
      active: o.active,
    }))
  )

  return options
}

export const getOrdersAssignedToUserSimpleHandler = async (req, res, next) => {
  const { userId, kitchenOrderId: paramKitchenOrderId } = req.params
  const { kitchenOrderId: queryKitchenOrderId } = req.query
  const kitchenOrderId = paramKitchenOrderId || queryKitchenOrderId

  try {
    const orders = await getOrdersAssignedToUserSimple(userId, kitchenOrderId)
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

export const updateOrderState = async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body

  try {
    // Validate that status is provided and is a valid enum value
    if (!status) {
      return res.status(400).json({
        error_message: 'El estado es requerido para la actualización de estado.',
      })
    }

    // Check if the provided status is valid according to the model
    const validStatuses = ['pending', 'preparing', 'ready_for_delivery', 'delivered']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error_message: `Estado inválido. Los estados válidos son: ${validStatuses.join(', ')}`,
      })
    }

    const updatedOrder = await KitchenOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // Return updated document and run schema validators
    ).populate({
      path: 'orders',
      select: 'user _id orderNum active price comments product deliveryDate cooking cooked',
      populate: [
        {
          path: 'user',
          select: 'name lastname username',
        },
        {
          path: 'product',
          select: 'name active',
        },
      ],
    }).populate({
      path: 'user',
      select: 'name lastname username',
    })

    if (!updatedOrder) {
      return res.status(404).json({
        error_message: `La orden de cocina con id ${id} no existe.`,
      })
    }

    res.json({
      message: `Estado de la orden de cocina ${id} actualizado exitosamente.`,
      order: updatedOrder,
    })
  } catch (err) {
    // Handle validation errors from mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message)
      return res.status(400).json({
        error_message: 'Error de validación',
        details: errors,
      })
    }
    next(err)
  }
}


export const searchKitchenOrdersByProductName = async (req, res, next) => {
  const { search } = req.query

  try {
    // Validate search parameter
    if (!search || search.trim() === '') {
      return res.status(400).json({
        error_message: 'El parámetro de búsqueda es requerido y no puede estar vacío.',
      })
    }

    // Step 1: Find all products matching the search criteria
    const matchingProducts = await Product.find({
      name: { $regex: search, $options: 'i' }, // Case-insensitive search
      deletedAt: null,
    }).select('_id')

    if (matchingProducts.length === 0) {
      return res.json({
        message: 'No se encontraron productos que coincidan con los criterios de búsqueda.',
        kitchenOrders: [],
      })
    }

    const productIds = matchingProducts.map((p) => p._id)

    // Step 2: Find all orders containing these products
    const ordersWithProducts = await Order.find({
      product: { $in: productIds },
      deletedAt: null,
    }).select('_id')

    if (ordersWithProducts.length === 0) {
      return res.json({
        message: 'No se encontraron órdenes que contengan los productos coincidentes.',
        kitchenOrders: [],
      })
    }

    const orderIds = ordersWithProducts.map((o) => o._id)

    // Step 3: Find all KitchenOrders that contain any of these orders
    const kitchenOrdersWithMatchingOrders = await KitchenOrder.find({
      orders: { $in: orderIds },
      deletedAt: null,
    }).select('orders')

    // Extract order IDs that are already assigned to KitchenOrders
    const assignedOrderIds = new Set()
    kitchenOrdersWithMatchingOrders.forEach((ko) => {
      ko.orders.forEach((orderId) => assignedOrderIds.add(orderId.toString()))
    })

    // Step 4: Find orders that are NOT assigned to any KitchenOrder
    const unassignedOrderIds = orderIds.filter((orderId) => !assignedOrderIds.has(orderId.toString()))

    // Step 5: Find all unassigned orders matching the search criteria with populated data
    const matchingOrders = await Order.find({
      _id: { $in: unassignedOrderIds },
      deletedAt: null,
    })
      .populate({
        path: 'user',
        select: 'name lastname username',
      })
      .populate({
        path: 'product',
        select: 'name active',
      })
      .sort({ createdAt: -1 })

    res.json({
      message: `Se encontraron ${matchingOrders.length} orden(es) que contienen productos que coinciden con "${search}" y no están asignadas a Pedido Cocina.`,
      orders: matchingOrders,
    })
  } catch (err) {
    next(err)
  }
}
