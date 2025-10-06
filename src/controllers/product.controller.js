import Product from '../models/Product'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { productSchema } from '../libs/validation/yupSchemas'

export const findAllProducts = async (req, res, next) => {
  try {
    const { size, page, search, isActive } = req.query
    const name = search
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined
    
    const condition = {
      ...(name && { name: { $regex: new RegExp(search), $options: 'i' } }),
      ...(isActiveBool !== undefined && { active: isActiveBool }),
      deletedAt: null,
    }
    const { limit, offset } = getPagination(page, size);

    const data = await Product.paginate(condition, {
      offset,
      limit,
      name,
      sort: { createdAt: -1 },
      populate: {
        path: 'ingredients.ingredient',
        select: 'name',
      },
    })
    if (condition.name) {
      const products = await Product.find({ name: { $regex: new RegExp(name), $options: 'i' } })
        .sort({ createdAt: -1 })
      data.docs = products;
    }
    // const products = data.docs

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
  try {
    await productSchema.validate(req.body, { abortEarly: true })

    const arrayIngredients = req.body.ingredients.map((ing) => ({
      ingredient: ing.ingredient,
      gms: ing.gms,
    }))

    const count = await setCounter('Product')

    const newProductData = new Product({
      productNum: count,
      name: req.body.name,
      ingredients: arrayIngredients,
      price: req.body.price,
      description: req.body.description,
      active: req.body.active ? req.body.active : true,
    })

    const newProduct = new Product(newProductData)

    const result = await newProduct.save()
    res.status(201).json({ result })
  } catch (error) {
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
  }
}

export const findOneProduct = async (req, res, next) => {
  const { id } = req.params

  try {
    const product = await Product.findById(id)
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

export const deleteAllProducts = async (req, res, next) => {
  try {
    await Product.deleteMany({})
    res.status(200).send({ message: 'All products was deleted.' })
  } catch (error) {
    console.error('Error trying delete all products:', error)
    res.status(500).send({ message: 'Error trying delete all products.' })

    next()
  }
}

export const sendToTrashProduct = async (req, res, next) => {
  const id = req.params.id
  try {
    const product = await Product.findById(id)

    const newDeletedState = product.deletedAt ? null : new Date()

    const updateProduct = await Product.findByIdAndUpdate(id, { deletedAt: newDeletedState })

    if (!updateProduct) {
      return res.status(404).json({
        error_message: `The product with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `product ${id} send to trash.`,
    })
  } catch (err) {
    next(err)
  }
}
