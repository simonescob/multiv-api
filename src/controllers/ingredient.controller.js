import Ingredient from '../models/Ingredient'
import { getPagination } from '../libs/getPagination'
import { imageHandler } from '../middlewares/image.handler'
// import Boom from '@hapi/boom'
import { ingredientSchema } from '../libs/validation/yupSchemas'

export const uploadImg = imageHandler.single('image')

export const findAllIngredients = async (req, res, next) => {
  try {
    const { size, page, name, inTrash = false } = req.query

    const condition = { inTrash }

    if (name) {
      condition.name = { $regex: new RegExp(name), $options: 'i' }
    }

    const { limit, offset } = getPagination(page, size)
    const data = await Ingredient.paginate(condition, { offset, limit, name })

    res.json({
      totalItems: data.totalDocs,
      ingredients: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })

    console.log(`Se han consultado los ingredientes.`)
  } catch (err) {
    next(err)
  }
}

export const createIngredient = async (req, res, next) => {
  // console.log(req.body)
  const { name, price, stock, active, inTrash } = req.body

  // const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png'
  try {
    await ingredientSchema.validate(req.body, { abortEarly: false })

    const imageFile = req.file
      ? {
          filename: req.file.filename ? req.file.filename : undefined,
          filepath: req.file.filename ? '/public/uploads/' + req.file.filename : undefined,
          mimetype: req.file.mimetype ? req.file.mimetype : undefined,
          originalname: req.file.originalname ? req.file.originalname : undefined,
          size: req.file.size ? req.file.size : undefined,
        }
      : ''

    const newIngredient = new Ingredient({
      name,
      price,
      stock,
      image: imageFile,
      active: active || true,
      inTrash: inTrash || false,
    })

    const result = await newIngredient.save()
    res.status(201).json({ result })
  } catch (error) {
    console.log(error)
    if (error.isBoom) {
      res.status(error.output.statusCode).json(error.output.payload)
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    } else {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
    next(error)
  }
}

export const findOneIngredient = async (req, res, next) => {
  const { id } = req.params

  try {
    const ingredient = await Ingredient.findById(id)
    if (!ingredient) {
      return res.status(404).json({
        error_message: `The ingredient with id ${id} does not exists.`,
      })
    }

    res.json(ingredient)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveIngredients = async (req, res, next) => {
  try {
    const activeIngredients = await Ingredient.find({ active: true })
    res.json({ activeIngredients })
  } catch (err) {
    next(err)
  }
}

export const findAllinTrashIngredients = async (req, res, next) => {
  try {
    const inTrashIngredients = await Ingredient.find({ inTrash: true })
    res.json({ inTrashIngredients })
  } catch (err) {
    next(err)
  }
}

export const updateIngredient = async (req, res, next) => {
  const id = req.params.id

  if (req.body.inTrash === true) {
    req.body = { ...req.body, active: false }
  }

  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(id, req.body)

    if (!updatedIngredient) {
      return res.status(404).json({
        error_message: `The ingredient with id: ${id} does not exists.`,
      })
    }
    res.json({
      message: `Ingredient ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteIngredient = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedIngredient = await Ingredient.findByIdAndDelete(id)
    if (!deletedIngredient) {
      return res.status(404).json({
        error_message: `The ingredient with id: ${id} does not exists.`,
      })
    }
    res.json({
      message: `Ingredient with id: ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
