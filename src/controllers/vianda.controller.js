import Vianda from '../models/Vianda';
import { getPagination } from '../libs/getPagination';

export const findAllViandas = async (req, res, next) => {
  try {
    const { size, page, title } = req.query;

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);
    const data = await Vianda.paginate(condition, { offset, limit, title });

    res.json({
      totalItems: data.totalDocs,
      viandas: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createVianda = async (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).send({
      error_message: 'Vianda title is required',
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      error_message: 'Vianda description is required',
    });
  }

  try {
    const newVianda = new Vianda({
      title: req.body.title,
      description: req.body.description,
      used: req.body.used ? req.body.used : false,
    });

    await newVianda
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } catch (err) {
    next(err);
  }
};

export const findAllUsedViandas = async (req, res, next) => {
  await Vianda.find({ used: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      throw err;
    });
  // res.json(usedViandas);
};

export const findOneVianda = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vianda = await Vianda.findById(id);
    if (!vianda) {
      return res.status(404).json({
        error_message: `The vianda with id ${id} does not exists.`,
      });
    }

    res.json(vianda);
  } catch (err) {
    next(err);
  }
};

export const deleteVianda = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedVianda = await Vianda.findByIdAndDelete(id);
    if (!deletedVianda) {
      return res.status(404).json({
        error_message: `The vianda with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Vianda with id: ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};

export const updateVianda = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedVianda = await Vianda.findByIdAndUpdate(id, req.body);

    if (!updatedVianda) {
      return res.status(404).json({
        error_message: `The vianda with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Vianda ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};
