import User from '../models/User'
import bcrypt from 'bcrypt'
import { getPagination } from '../libs/getPagination'
import { userSchema } from '../libs/validation/yupSchemas'

export const findAllUsers = async (req, res, next) => {
  try {
    const { size, page, name, role } = req.query

    const condition = {
      ...(name && { name: { $regex: new RegExp(name), $options: 'i' } }),
      ...(role && { role }),
    }
    const { limit, offset } = getPagination(page, size)

    const data = await User.paginate(condition, {
      offset,
      limit,
    })

    const dataUsers = data.docs.map((user) => {
      user.hashedPassword = undefined
      return user
    })

    res.json({
      totalItems: data.totalDocs,
      users: dataUsers,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    })
  } catch (err) {
    next(err)
  }
}

export const createUser = async (req, res, next) => {
  try {
    await userSchema.validate(req.body, { abortEarly: true })
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUserData = new User({
      username: req.body.username,
      name: req.body.name,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      location: req.body.location,
      birth: req.body.birth,
      role: req.body.role,
      hashedPassword,
    })

    const newUser = new User(newUserData)

    const result = await newUser.save()
    result.hashedPassword = undefined

    res.status(201).json({ result })
  } catch (error) {
    console.error('Errores de validación:', error.errors)
    res.status(400).json({ error: 'Error de validación', detalles: error.errors })
    next(error)
  }
}

export const findOneUser = async (req, res, next) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        error_message: `User with id ${id} does not exists.`,
      })
    }

    user.hashedPassword = undefined

    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const findByUsername = async (username) => {
  const user = await User.findOne({
    username,
  })
  return user
}
export const findByEmail = async (email) => {
  const user = await User.findOne({
    email,
  })
  return user
}

// export const findAllUsersByRole = async (req, res, next) => {
//   try {
//     const { size, page, role } = req.query

//     const condition = role
//       ? {
//           role: { $regex: new RegExp(role), $options: 'i' },
//         }
//       : {}

//     const { limit, offset } = getPagination(page, size)

//     const data = await User.paginate(condition, {
//       offset,
//       limit,
//       role,
//     })

//     const dataUsers = data.docs.map((user) => {
//       user.hashedPassword = undefined
//       return user
//     })

//     res.json({
//       totalItems: data.totalDocs,
//       users: dataUsers,
//       totalPages: data.totalPages,
//       currentPage: data.page - 1,
//     })
//   } catch (err) {
//     next(err)
//   }
// }

export const findAllActiveUsers = async (req, res, next) => {
  try {
    const activeUsers = await User.find({ active: true })
    res.json({ activeUsers })
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  const id = req.params.id
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body)

    if (!updatedUser) {
      return res.status(404).json({
        error_message: `The user with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `User ${id} updated.`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return res.status(404).json({
        error_message: `The user with id ${id} does not exists.`,
      })
    }
    res.json({
      message: `User with id ${id} was deleted.`,
    })
  } catch (err) {
    next(err)
  }
}
