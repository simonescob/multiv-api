import Menu from '../models/Menu'
import Product from '../models/Product'
import { getPagination } from '../libs/getPagination'
import mongoose from 'mongoose'

export const findAllMenus = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await Menu.paginate(condition, {
      offset,
      limit,
      name,
      populate: {
        path: 'products',
        select: 'name _id active price', // Especifica los campos que deseas poblar del documento 'product'
      },
    })

    res.json({
      totalItems: data.totalDocs,
      menus: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createMenu = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Menu name is required',
    })
  }

  if (!req.body.products) {
    return res.status(400).send({
      error_message: 'Menu products are required',
    })
  }

  // check ingredients on ddbb

  const validProducts = req.body.products.filter((id) => mongoose.Types.ObjectId.isValid(id))

  const productExist = await Product.find({
    _id: { $in: validProducts },
  })

  if (productExist.length !== req.body.products.length) {
    return res.status(400).send({
      error_message: 'Some products not exists.',
    })
  }

  try {
    const newMenu = new Menu({
      name: req.body.name,
      comments: req.body.comments,
      products: req.body.products,
      active: req.body.active ? req.body.active : true,
    })

    await newMenu
      .save()
      .then((result) => {
        console.log(`Menu with id ${result._id} was created.`)
        res.json({ result })
      })
      .catch((err) => {
        // res.status(500).json({ err });
        res.status(500).json({ err })
      })
  } catch (err) {
    next(err)
  }
}

export const findOneMenu = async (req, res, next) => {
  const { id } = req.params

  try {
    const menu = await Menu.findById(id).populate({
      path: 'products',
      select: 'name _id active price',
    })

    if (!menu) {
      return res.status(404).json({
        error_message: `The menu with id ${id} does not exists.`,
      })
    }

    res.json(menu)
  } catch (err) {
    next(err)
  }
}

export const findAllActiveMenus = async (req, res, next) => {
  try {
    const activeMenus = await Menu.find({ active: true }).populate('products')
    res.json({ activeMenus })
  } catch (err) {
    next(err)
  }
}

export const updateMenu = async (req, res, next) => {
  const id = req.params.id
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(id, req.body)

    if (!updatedMenu) {
      return res.status(404).json({
        error_message: `The menu with id: ${id} does not exists.`,
      })
    }
    res.json({
      message: `Menu ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteMenu = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedMenu = await Menu.findByIdAndDelete(id)
    if (!deletedMenu) {
      return res.status(404).json({
        error_message: `The menu with id: ${id} does not exists.`,
      })
    }
    res.json({
      message: `Menu with id: ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
