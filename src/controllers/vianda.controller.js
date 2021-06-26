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

// function interseccion(datos1, datos2, comparacion) {
//   if (!Array.isArray(datos1) || !Array.isArray(datos2)) {
//       throw TypeError('Los argumentos «datos1» y «datos2» deben ser arreglos.');
//   }

//   if (typeof comparacion !== 'function') {
//       throw TypeError('El argumento «comparacion» debe ser una función.');
//   }

//   let conjunto1 = [...datos1.map(d => comparacion(d))];
//   let conjunto2 = [...datos2.map(d => comparacion(d))];

//   return Array.from(new Set([...conjunto1].filter(e => new Set(conjunto2).has(e))));
// }

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

  //traigo ings
  try {
    //los que tengo
    const names = req.body.ingredients;

    // los que estan cargados
    const ingredientsObjectList = await Ingredient.find(
      { name: { $in: names } },
      async (err, data) => (data ? data : err)
    );

    //hago el array de ids que existen
    const idIngredientsList = ingredientsObjectList.map(({ _id }) => _id);
    //hago el array de names que existen
    const nameIngredientsList = ingredientsObjectList.map(({ name }) => name);

    const newIngredients = names.reduce((acu, ele) => {
      const newEl = nameIngredientsList.filter((e) => {
        return e === ele;
      });

      newEl[0] ? acu.push(newEl[0]) : null;

      return acu;
    }, []);

    

    console.log(newIngredients);

    console.log(`Los ingresados por usuarios: ${names}`);
    console.log(`Los que ya estan cargados por id: ${idIngredientsList}`);
    console.log(`Los que ya estan cargados por nombre ${nameIngredientsList}`);
  } catch (err) {
    next(err);
  }

  try {
    const newVianda = new Vianda({
      name: req.body.name,
      description: req.body.description,
      ingredients: [],
      active: req.body.active ? req.body.active : true,
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
    res.json({ activeViandas });
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
