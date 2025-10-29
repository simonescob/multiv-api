import Menu from '../models/Menu'
import { getPagination } from '../libs/getPagination'
import { setCounter } from '../libs/setCounter'
import { menuSchema } from '../libs/validation/yupSchemas'

export const findAllMenus = async (req, res, next) => {
  try {
    const { size, page, search, isActive } = req.query
    const name = search
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined

    const condition = {
      ...(name && { name: { $regex: new RegExp(name), $options: 'i' } }),
      deletedAt: null,
      ...(isActiveBool !== undefined && { active: isActiveBool }),
    }

    const { limit, offset } = getPagination(page, size)

    const data = await Menu.paginate(condition, {
      offset,
      limit,
      name,
      sort: { _id: -1 },
      populate: [
        {
          path: 'menuOptions.lunch',
          select: 'name _id productNum active price',
        },
        {
          path: 'menuOptions.dinner',
          select: 'name _id productNum active price',
        }
      ],
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
  try {
    await menuSchema.validate(req.body, { abortEarly: true })

    const count = await setCounter('Menu')
    const newMenuData = {
      name: req.body.name,
      menuOptions: req.body.menuOptions || [
        {
          name: req.body.name,
          lunch: req.body.lunch || [],
          dinner: req.body.dinner || [],
          active: req.body.active !== undefined ? req.body.active : true,
          deletedAt: null,
        }
      ],
    }

    const newMenu = new Menu(newMenuData)

    const result = await newMenu.save()
    res.status(201).json({ result })
  } catch (error) {
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    next(error)
  }
}

export const findOneMenu = async (req, res, next) => {
  const { id } = req.params

  try {
    const menu = await Menu.findById(id).populate([
      {
        path: 'menuOptions.lunch',
        select: 'name _id productNum active price',
      },
      {
        path: 'menuOptions.dinner',
        select: 'name _id productNum active price',
      }
    ])

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
    const activeMenus = await Menu.find({ active: true }).populate([
      {
        path: 'menuOptions.lunch',
        select: 'name _id productNum active price',
      },
      {
        path: 'menuOptions.dinner',
        select: 'name _id productNum active price',
      }
    ])
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

export const deleteAllMenus = async (req, res, next) => {
  try {
    await Menu.deleteMany({})
    res.status(200).send({ message: 'All menus was deleted.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Error trying delete all menus.' })

    next()
  }
}

export const sendToTrashMenu = async (req, res, next) => {
  const id = req.params.id
  try {
    const menu = await Menu.findById(id)

    const newDeletedState = menu.deletedAt ? null : new Date()

    const updateMenu = await Menu.findByIdAndUpdate(id, { deletedAt: newDeletedState })

    if (!updateMenu) {
      return res.status(404).json({
        error_message: `Menu with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `Menu ${id} send to trash.`,
    })
  } catch (err) {
    next(err)
  }
}
