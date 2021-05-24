import Ingredient from '../models/Ingredient';
import { getPagination } from '../libs/getPagination';

export const findAllIngredients = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
        name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);
    const data = await Ingredient.paginate(condition, { offset, limit, name });

    res.json({
      totalItems: data.totalDocs,
      ingredients: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createIngredient = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Ingredient name is required',
    });
  }

  try {
    const newIngredient = new Ingredient({
      name: req.body.name,
    });

    await newIngredient
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
