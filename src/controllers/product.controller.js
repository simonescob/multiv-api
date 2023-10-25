import Product from '../models/Product'
import Ingredient from '../models/Ingredient'
import { getPagination } from '../libs/getPagination'
import mongoose from 'mongoose'

export const findAllProducts = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await Product.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'ingredients',
    })

    res.json({
      totalItems: data.totalDocs,
      products: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createProduct = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Product name is required',
    })
  }

  if (!req.body.price) {
    return res.status(400).send({
      error_message: 'Product price is required',
    })
  }

  if (!req.body.ingredients || !Array.isArray(req.body.ingredients) || !req.body.ingredients.length) {
    return res.status(400).send({
      error_message: 'Ingredients are required and need to be an array with data.',
    })
  }

  // check ingredients on ddbb

  const ingredientIds = req.body.ingredients.map((item) => item.ingredient)

  const validIngredientIds = ingredientIds.filter((id) => mongoose.Types.ObjectId.isValid(id))

  const ingExs = await Ingredient.find({
    _id: { $in: validIngredientIds },
  })

  if (ingExs.length !== req.body.ingredients.length) {
    return res.status(400).send({
      error_message: 'Some ingredient not exists.',
    })
  }
  const arrayIngredients = req.body.ingredients.map((ing) => ({
    _id: ing.ingredient,
    gms: ing.gms,
  }))

  try {
    const newProduct = new Product({
      name: req.body.name,
      ingredients: arrayIngredients,
      price: req.body.price,
      description: req.body.description,
      active: req.body.active ? req.body.active : true,
    })

    await newProduct
      .save()
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        res.status(500).json({ err })
      })
  } catch (err) {
    next(err)
  }
}

export const findOneProduct = async (req, res, next) => {
  const { id } = req.params

  try {
    const product = await Product.findById(id).populate('ingredients')
    if (!product) {
      return res.status(404).json({
        error_message: `The prduct with id ${id} does not exists.`,
      })
    }

    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveProducts = async (req, res, next) => {
  try {
    const activeProducts = await Product.find({ active: true })
    res.json({ activeProducts })
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req, res, next) => {
  const id = req.params.id
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body)

    if (!updatedProduct) {
      return res.status(404).json({
        error_message: `The product with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Product ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return res.status(404).json({
        error_message: `The product with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Product with id ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
