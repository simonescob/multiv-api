import Vianda from '../models/Vianda';
import Ingredient from '../models/Ingredient';
import { getPagination } from '../libs/getPagination';

export const findAllViandas = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await Vianda.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'ingredients',
    });

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
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Vianda name is required',
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      error_message: 'Vianda description is required',
    });
  }

  if (!req.body.ingredients) {
    return res.status(400).send({
      error_message: 'Vianda ingredients is required',
    });
  }

  try {
    const newVianda = new Vianda({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      active: req.body.active ? req.body.active : false,
    });

    const ings = Array();

    newVianda.ingredients.map((ingredient) => {
      ings.push(ingredient);
    });

    Ingredient.find({ _id: { $in: ings } }, async (err, data) => {
      if (ings.length === data.length) {
        await newVianda
          .save()
          .then((result) => {
            res.json({ result });
          })
          .catch((err) => {
            // res.status(500).json({ err });
            throw err;
          });
      } else {
        return res.status(500).send({
          error_message: `Alguno ingrediente es inexistente. Error: ${err}`,
        });
      }
    });
  } catch (err) {
    next(err);
  }
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


export const findAllActiveViandas = async (req, res, next) => {
  try {
    const activeViandas = await Vianda.find({ active: true });
    res.json({activeViandas});
  } catch (err) {
    next(err);
  }
  // await Vianda.find({ used: true })
  //   .then((result) => {
  //     res.json(result);
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
  // // res.json(usedViandas);
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


