import Profile from '../models/Profile';
import User from '../models/User';
import { getPagination } from '../libs/getPagination';

export const findAllProfiles = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
        name: { $regex: new RegExp(name), $options: 'i' },
      }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await Profile.paginate(condition, {
      offset,
      limit,
      name
    });

  

    res.json({
      totalItems: data.totalDocs,
      profiles: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createProfile = async (req, res, next) => {
  if (!req.body.user) {
    return res.status(400).send({
      error_message: 'User profile is required',
    });
  }

  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Profile name is required',
    });
  }

  const user = req.body.user
  const existingUserProfile = await Profile.findOne({user});

  if(existingUserProfile) {
    return res.status(400).send({
      error_message: 'Profile user ready exists',
    });
  }
  
  const userNotExist = await User.findById(user);

  if(!userNotExist) {
    return res.status(400).send({
      error_message: 'That user not exists',
    });
  }
  

  try {
    const newProfile = new Profile({
      user: req.body.user,
      name: req.body.name,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      direction: req.body.direction,
      location: req.body.location,
      birth: req.body.birth,
    });

    await newProfile
      .save()
      .then((result) => {
        console.log(`Profile with id ${result._id} was created.`);
        res.json({ result });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    next(err);
  }
};

export const findOneProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await Profile.findById(id).populate('plan');
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


export const findAllActiveProfiles = async (req, res, next) => {
  try {
    const activeProfiles = await Profile.find({ active: true });
    res.json({ activeProfiles });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(id, req.body);
    

    if (!updatedProfile) {
      return res.status(404).json({
        error_message: `The profile with id ${id} does not exists.`,
      });
    }
    res.json({
      message: `Profile ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) {
      return res.status(404).json({
        error_message: `Profile with id ${id} does not exists.`,
      });
    }
    res.json({
      message: `Profile with id ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
