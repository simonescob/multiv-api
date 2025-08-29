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
            select: 'name', // Incluir el campo 'name' del usuario
          },
        ],
      })
      .populate({
        path: 'user',
        select: 'username name lastname',
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

export const deleteAllKitchenOrders = async (req, res, next) => {
  try {
    await KitchenOrder.deleteMany({})
    res.status(200).send({ message: 'All kitchen orders was deleted.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Error trying delete all orders.' })

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
        error_message: `The kitchen order with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `The kitchen order ${id} send to trash.`,
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
        error_message: `User with id ${userId} does not exist.`,
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
        error_message: `User with id ${userId} exists, but has no kitchen orders for the specified date range.`,
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
