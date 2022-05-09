import Costumer from '../models/Costumer';
import { getPagination } from '../libs/getPagination';

export const findAllCostumers = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await Costumer.paginate(condition, {
      offset,
      limit,
      name
    });

    res.json({
      totalItems: data.totalDocs,
      costumers: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createCostumer = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Costumer name is required',
    });
  }

  const NO_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png'

  try {
    const newCostumer = new Costumer({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      avatar: req.body.imgUrl ? req.body.avatar : NO_AVATAR,
      address: req.body.address,
      age: req.body.age,
      active: req.body.active ? req.body.active : true,
    });

    await newCostumer
      .save()
      .then((result) => {
        console.log(`Costumer ${result._id} was created.`);
        res.json({ result });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    next(err);
  }
};

export const findOneCostumer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const costumer = await Costumer.findById(id);
    if (!costumer) {
      return res.status(404).json({
        error_message: `Not founded costumer ${id}.`,
      });
    }

    res.json(costumer);
  } catch (err) {
    next(err);
  }
};

export const findAllActiveCostumers = async (req, res, next) => {
  try {
    const activeCostumers = await Costumer.find({ active: true });
    res.json({ activeCostumers });
  } catch (err) {
    next(err);
  }
};

export const updateCostumer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedCostumer = await Costumer.findByIdAndUpdate(id, req.body);

    if (!updatedCostumer) {
      return res.status(404).json({
        error_message: `Not founded costumer ${id}.`,
      });
    }
    res.json({
      message: `Costumer ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCostumer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedCostumer = await Costumer.findByIdAndDelete(id);
    if (!deletedCostumer) {
      return res.status(404).json({
        error_message: `Not founded costumer ${id}.`,
      });
    }
    res.json({
      message: `Costumer ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
