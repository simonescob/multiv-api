import User from '../models/User';
import { getPagination } from '../libs/getPagination';

export const findAllUsers = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await User.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'plan',
    });

    res.json({
      totalItems: data.totalDocs,
      users: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'User name is required',
    });
  }


  try {
    const newUser = new User({
      name: req.body.name,
      direction: req.body.direction,
      location: req.body.location,
      age: req.body.age,
      medical: req.body.medical ? req.body.medical : false,
      active: req.body.active ? req.body.active : false,
    });

    await newUser
      .save()
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    next(err);
  }
};

export const findOneUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('plan');
    if (!user) {
      return res.status(404).json({
        error_message: `The user with id ${id} does not exists.`,
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const findAllActiveUsers = async (req, res, next) => {
  try {
    const activeUsers = await User.find({ active: true });
    res.json({ activeUsers });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({
        error_message: `The user with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `User ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        error_message: `The user with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `User with id: ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
