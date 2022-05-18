import Customer from '../models/Customer';
import { getPagination } from '../libs/getPagination';

export const findAllCustomers = async (req, res, next) => {
  try {
    // const { size, page, name } = req.query;
    const { size, page, name, inTrash = false } = req.query;

    // const condition = name
    //   ? {
    //     name: { $regex: new RegExp(name), $options: 'i' },
    //   }
    //   : {};

    const condition = { inTrash }

    if (name) {
      condition.name = { $regex: new RegExp(name), $options: 'i' }
    }


    const { limit, offset } = getPagination(page, size);

    const data = await Customer.paginate(condition, {
      offset,
      limit,
      name
    });

    res.json({
      totalItems: data.totalDocs,
      customers: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Customer name is required',
    });
  }

  if (!req.body.lastname) {
    return res.status(400).send({
      error_message: 'Customer lastname is required',
    });
  }

  const NO_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png'

  try {
    const newCustomer = new Customer({
      name: req.body.name,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      avatar: req.body.avatar ? req.body.avatar : NO_AVATAR,
      address: req.body.address,
      age: req.body.age,
      cupons: req.body.cupons,
      active: req.body.active ? req.body.active : true,
      inTrash: req.body.inTrash ? req.body.inTrash : false
    });

    await newCustomer
      .save()
      .then((result) => {
        console.log(`Customer ${result._id} was created.`);
        res.json({ result });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    next(err);
  }
};

export const findOneCustomer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        error_message: `Not founded customer ${id}.`,
      });
    }

    res.json(customer);
  } catch (err) {
    next(err);
  }
};

export const findAllActiveCustomers = async (req, res, next) => {
  try {
    const activeCustomers = await Customer.find({ active: true });
    res.json({ activeCostumers });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updateCustomer = await Customer.findByIdAndUpdate(id, req.body);

    if (!updateCustomer) {
      return res.status(404).json({
        error_message: `Not founded customer ${id}.`,
      });
    }
    res.json({
      message: `Customer ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({
        error_message: `Not founded customer ${id}.`,
      });
    }
    res.json({
      message: `Customer ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
