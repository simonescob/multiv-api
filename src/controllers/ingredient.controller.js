import Ingredient from '../models/Ingredient';
import { getPagination } from '../libs/getPagination';
import { storage, imageHandler } from '../middlewares/image.handler';


export const uploadImg = imageHandler.single('image');

export const findAllIngredients = async (req, res, next) => {
  try {
    const { size, page, name, inTrash = false } = req.query;

    const condition = { inTrash }

    if (name) {
      condition.name = { $regex: new RegExp(name), $options: 'i' }
    }

    const { limit, offset } = getPagination(page, size);
    const data = await Ingredient.paginate(condition, { offset, limit, name });


    res.json({
      totalItems: data.totalDocs,
      ingredients: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });

    console.log(`Se han consultado los ingredientes.`)

  } catch (err) {
    next(err);
  }
};

export const createIngredient = async (req, res, next) => {

  // console.log(req.body)

  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Ingredient name is required',
    });
  }
  // const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png'
  try {
    const newIngredient = new Ingredient({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      image: {
        filename: req.file.filename ? req.file.filename : undefined,
        filepath: req.file.filename ? '/public/uploads/' + req.file.filename : undefined,
        mimetype: req.file.mimetype ? req.file.mimetype : undefined,
        originalname: req.file.originalname ? req.file.originalname : undefined,
        size: req.file.size ? req.file.size : undefined,
    },
      active: req.body.active ? req.body.active : true,
      inTrash: req.body.inTrash ? req.body.inTrash : false
    });

    await newIngredient
      .save()
      .then((result) => {
        console.log(`Ingredient with id ${result._id} was created.`)
        res.json({ result });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } catch (err) {
    next(err);
  }
};


export const findOneIngredient = async (req, res, next) => {
  const { id } = req.params;

  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({
        error_message: `The ingredient with id ${id} does not exists.`,
      });
    }

    res.json(ingredient);
  } catch (err) {
    next(err);
  }
};

export const findAllActiveIngredients = async (req, res, next) => {
  try {
    const activeIngredients = await Ingredient.find({ active: true });
    res.json({ activeIngredients });
  } catch (err) {
    next(err);
  }

};

export const findAllinTrashIngredients = async (req, res, next) => {
  try {
    const inTrashIngredients = await Ingredient.find({ inTrash: true });
    res.json({ inTrashIngredients });
  } catch (err) {
    next(err);
  }

};

export const updateIngredient = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.inTrash === true) {
    req.body = { ...req.body, active: false }
  }

  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(id, req.body);

    if (!updatedIngredient) {
      return res.status(404).json({
        error_message: `The ingredient with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Ingredient ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteIngredient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);
    if (!deletedIngredient) {
      return res.status(404).json({
        error_message: `The ingredient with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Ingredient with id: ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
