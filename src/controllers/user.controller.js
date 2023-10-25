import User from '../models/User'
import bcrypt from 'bcrypt'
import { getPagination } from '../libs/getPagination'

export const findAllUsers = async (req, res, next) => {
  try {
    const { size, page, name } = req.query

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {}

    const { limit, offset } = getPagination(page, size)

    const data = await User.paginate(condition, {
      offset,
      limit,
      name,
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
  if (!req.body.username) {
    return res.status(400).send({
      error_message: 'User name is required',
    })
  }

  if (!req.body.password) {
    return res.status(400).send({
      error_message: 'User password is required',
    })
  }

  // if (!req.body.role) {
  //   return res.status(400).send({
  //     error_message: 'User role is required',
  //   });
  // }

  if (!req.body.email) {
    return res.status(400).send({
      error_message: 'User email is required',
    })
  }

  // check if username or email exists

  const existingUsername = await findByUsername(req.body.username)
  const existingEmail = await findByEmail(req.body.email)

  if (existingUsername) {
    return res.status(400).send({
      error_message: 'Username ready exists',
    })
  }

  if (existingEmail) {
    return res.status(400).send({
      error_message: 'Email ready exists',
    })
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      hashedPassword,
    })

    await newUser
      .save()
      .then((result) => {
        result.hashedPassword = undefined
        console.log(`User with id ${result._id} was created.`)
        res.json({ result })
      })
      .catch((err) => {
        throw err
      })
  } catch (err) {
    next(err)
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
