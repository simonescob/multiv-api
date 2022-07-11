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

  //traigo ings
  try {
    //los que tengo
    const { ingredients } = req.body;

    // los que estan cargados
    const ingredientsObjectList = await Ingredient.find(
      { name: { $in: ingredients } },
      async (err, data) => (data ? data : err)
    );


    //hago el array de ids que existen
    const idIngredientsList = ingredientsObjectList.map(({ _id }) => _id);


    //hago el array de titles que existen
    const namesIngredientsList = ingredientsObjectList.map(({ name }) => name);

    //hago el array de los que no existen
    const namesNoExisten = ingredients.filter(
      (el) => !namesIngredientsList.includes(el)
    );


    const newIngredients = namesNoExisten.reduce((a, e) => {
      a.push({ name: e });
      return a;
    }, []);

    // console.log(newIngredients);

    const newIngredientData = async (data) => {
      try {
        const allNewSavedIngredients = await Ingredient.insertMany(data);
        return allNewSavedIngredients;
      } catch (err) {
        throw err;
      }
    };

    newIngredientData(newIngredients)
      .then((res) => {
        const allIngredientsIds = res.reduce((a, el) => {
          a.push(el._id);
          return a;
        }, idIngredientsList);

        return allIngredientsIds;
      })
      .then((res) => {

        const newVianda = new Vianda({
          name: req.body.name,
          description: req.body.description,
          ingredients: res,
          active: req.body.active ? req.body.active : true,
        });

        return newVianda;
      })
      .then((res) => res.save())
      .then((result) => {

        console.log(`Se ha creado una vianda con id: ${result._id}`)
        res.json(result);

      })

      .catch((e) => console.log(e));

    // console.log(`Los ingresados por usuarios: ${names}`);
    // console.log(`Los que ya estan cargados por nombre ${namesIngredientsList}`);
    // console.log(`Los que no estan cargados por nombre ${namesNoExisten}`);
    // console.log(`Prontos para cargar por id ${idIngredientsList}`);
  } catch (err) {
    next(err);
  }

  try {
  } catch (err) {
    next(err);
  }
};

export const findOneVianda = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vianda = await Vianda.findById(id).populate('ingredients');
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
