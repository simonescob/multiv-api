import Vianda from '../models/Vianda';
import { getPagination } from '../libs/getPagination';

export const findAllViandas = async (req, res, next) => {
  try {
    const { size, page, title } = req.query;

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);
    const data = await Vianda.paginate(condition, { offset, limit, title });

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
  if (!req.body.title) {
    return res.status(400).send({
      error_message: 'Vianda title is required',
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      error_message: 'Vianda description is required',
    });
  }

  try {
    const newVianda = new Vianda({
      title: req.body.title,
      description: req.body.description,
      used: req.body.used ? req.body.used : false,
    });

    await newVianda
      .save()
      .then((result) => {
          
            res.json(result);
          
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } catch (err) {
    next(err);
  }
};

// export const findAllUsedVehicles = async (req, res, next) => {
//   try {
//     const usedVehicles = await Vehicle.find({ used: true });
//     res.json(usedVehicles);
//   } catch (err) {
//     next(err);
//   }
// };

// export const findOneVehicle = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const vehicle = await Vehicle.findById(id);
//     if (!vehicle) {
//       return res.status(404).json({
//         error_message: `The vehicle with id ${id} does not exists.`,
//       });
//     }

//     res.json(vehicle);
//   } catch (err) {
//     next(err);
//     // res.status(500).json({
//     //   message_error: err.message || `Error retrieving vehicle with id: ${id}`,
//     // });
//   }
// };

// export const deleteVehicle = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedVehicle = await Vehicle.findByIdAndDelete(id);
//     if (!deletedVehicle) {
//       return res.status(404).json({
//         error_message: `The vehicle with id: ${id} does not exists.`,
//       });
//     }
//     res.json({
//       message: `Vehicle with id: ${id} was deleted.`,
//     });
//   } catch (err) {
//     next(err);
//     // res.status(500).json({
//     //   message_error: err.message || `Error deleting vehicle with id: ${id}`,
//     // });
//   }
// };

// export const updateVehicle = async (req, res, next) => {
//   const id = req.params.id;
//   try {
//     const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body);

//     if (!updatedVehicle) {
//       return res.status(404).json({
//         error_message: `The vehicle with id: ${id} does not exists.`,
//       });
//     }
//     res.json({
//       message: `Vehicle ${id} updated.`,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
