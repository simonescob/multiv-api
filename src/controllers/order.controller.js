import Order from '../models/Order';
// import Ingredient from '../models/Ingredient';
import { getPagination } from '../libs/getPagination';

export const findAllOrders = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await Order.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'user',
    });

    res.json({
      totalItems: data.totalDocs,
      orders: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Order name is required',
    });
  }

  if (!req.body.comments) {
    return res.status(400).send({
      error_message: 'Order comments is required',
    });
  }


  try {
    const newOrder = new Order({
      name: req.body.name,
      comments: req.body.comments,
      user: req.body.user,
      arrival_date: req.body.arrival_date,
      active: req.body.active ? req.body.active : true,
    });

    await newOrder
          .save()
          .then((result) => {
            res.json({ result });
          })
          .catch((err) => {
            throw err;
          });

  } catch (err) {
    next(err);
  }
};

export const findOneOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        error_message: `The order with id ${id} does not exists.`,
      });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};


export const findAllActiveOrders = async (req, res, next) => {
  try {
    const activeOrders = await Order.find({ active: true });
    res.json({activeOrders});
  } catch (err) {
    next(err);
  }
  await Order.find({ used: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      throw err;
    });
};

export const updateOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
      const updateOrder = await Order.findByIdAndUpdate(id, req.body);
  
      if (!updateOrder) {
        return res.status(404).json({
          error_message: `The order with id: ${id} does not exists.`,
        });
      }
      res.json({
        message: `Order ${id} updated.`,
      });
    } catch (err) {
      next(err);
    }
  };


export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteOrder = await Order.findByIdAndDelete(id);
    if (!deleteOrder) {
      return res.status(404).json({
        error_message: `The order with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Vianda order id: ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};


