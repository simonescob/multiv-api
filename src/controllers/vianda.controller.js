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
    //todos los nombres
    const names = req.body.ingredients;
    const ings = [];
    

    const ingredientlist = await names.map(async (name) => {
      const ingredient = await Ingredient.find(
        { name: name },
        async (err, data) => {
          if (data.length === 0) {
            console.log('crear ingrediente nuevo');
            try {
              const newIngredient = new Ingredient({
                name: name,
                active: true,
              });

              const newing = await newIngredient
                .save()
                .then((result) => {
                  console.log(`Ingredient with id ${result._id} was created.`);

                  res.json({ result });
                  return result._id;
                })
                .catch((err) => {
                  res.status(500).json({ err });
                });

              return newing;
            } catch (err) {
              next(err);
            }
          } else {
            console.log('este ingrediente ya existe');

            return data[0]._id;
          }
        }
      );

      
      await console.log(`Id de ingrediente: ${ingredient[0]._id}`);

      await ings.push(ingredient[0]._id);

      // console.log(`Array de ings: ${ings}`);
      return ings;
    });


    
    const carrea = [];
    const ingredientsarray = await ingredientlist.map(async (ingredient) => {
      // console.log(ingredient)

      await ingredient.then(async (res) => {
        console.log(res)
       await carrea.push(res);
        
      });
      return carrea;
    });

    // await ingredient.then((res) => {
    //   return console.log(`esto es la res ${res}`);
    // });
    // console.log(ingredient)
    // const ing = await ingredient
    // return ing
    //   // return ingredient.then((res) => res.push(res));
    // });

    console.log(ingredientsarray);

    // cargados.map(ingrediente => {

    //   return ings.push(ingrediente._id)

    //   // console.log(ingrediente._id)
    // })

    // const existen = Ingredient.find(
    //   { name: { $in: names } },
    //   async (err, data) => data
    // )
    //   .then((res) => {
    //     res.map((ingredientes) => {
    //       ings.push(ingredientes._id);

    //       return ings;
    //     });
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    // existen.then(res => {
    //   console.log(res)
    // });

    // console.log(ings);

    // const promises = names.map((name) => {
    //   Ingredient.find({ name: name }, async (err, data) => {
    //     if (data.length === 0) {
    //       try {
    //         const newIngredient = new Ingredient({
    //           name: name,
    //           active: true,
    //         });

    //         await newIngredient
    //           .save()
    //           .then(async (result) => {
    //             console.log(`Ingredient with id ${result._id} was created.`);
    //             ings.push(result._id);
    //             // console.log(`ahora hay ${ings}`)
    //             res.json({ result });
    //           })
    //           .catch((err) => {
    //             res.status(500).json({ err });
    //           });
    //       } catch (err) {
    //         next(err);
    //       }
    //     } else {
    //       ings.push(data[0]._id);
    //       // console.log(`ahora hay ${ings}`)
    //     }

    //     // console.log(`ahora hay ${ings} en el find`)
    //   })
    //     .then((res) => {
    //       // console.log(`La res: ${res}`)
    //       // console.log(`Los ings: ${ings}`)
    //       // // ings;
    //       return res;
    //     })
    //     .catch((err) => {
    //       throw err;
    //     });
    // });

    // promises.map((promise) => {

    //   promise.then(res => {
    //     console.log(res)
    //   })

    // });

    // console.log(`hay ${promises.then}`)

    // if(ings) {

    //   console.log(`hay ${ings}`)
    //   console.log(`hay ${promises[0].then(console.log(ings))}`)
    //   console.log(`hay ${promises}`)
    // } else {

    //   console.log(`hay ${promises}`)
    // }

    // console.log(ings);

    const newVianda = new Vianda({
      name: req.body.name,
      description: req.body.description,
      ingredients: ings,
      active: req.body.active ? req.body.active : true,
    });

    // console.log(newVianda.ingredients);

    // const ings = Array();

    // newVianda.ingredients.map((ingredient) => {
    //   ings.push(ingredient);
    // });

    // console.log(req.body.ingredients)
    // console.log(newVianda.ingredients)
    // console.log(ings)

    // Ingredient.find({ _id: { $in: ings } }, async (err, data) => {
    //   if (ings.length === data.length) {
    //     await newVianda
    //       .save()
    //       .then((result) => {
    //         console.log(`Vianda with id ${result._id} was created.`)
    //         res.json({ result });
    //       })
    //       .catch((err) => {
    //         // res.status(500).json({ err });
    //         throw err;
    //       });
    //   } else {
    //     return res.status(500).send({
    //       error_message: `Alguno ingrediente es inexistente. Error: ${err}`,
    //     });
    //   }
    // });
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
