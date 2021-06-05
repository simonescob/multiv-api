import Menu from '../models/Menu';
import Vianda from '../models/Vianda';
import { getPagination } from '../libs/getPagination';

export const findAllMenus = async (req, res, next) => {
  try {
    const { size, page, name } = req.query;

    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: 'i' },
        }
      : {};

    const { limit, offset } = getPagination(page, size);

    const data = await Menu.paginate(condition, {
      offset,
      limit,
      name,
      populate: 'viandas',
    });
    
    res.json({
      totalItems: data.totalDocs,
      menus: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
    });
  } catch (err) {
    next(err);
  }
};

export const createMenu = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error_message: 'Menu name is required',
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      error_message: 'Menu description is required',
    });
  }

  if (!req.body.viandas) {
    return res.status(400).send({
      error_message: 'Menu viandas is required',
    });
  }

  try {
    const newMenu = new Menu({
      name: req.body.name,
      description: req.body.description,
      viandas: req.body.viandas,
      active: req.body.active ? req.body.active : true,
    });

    const viandas = Array();

    newMenu.viandas.map((vianda) => {
      viandas.push(vianda);
    });

    Vianda.find({ _id: { $in: viandas } }, async (err, data) => {
      if (viandas.length === viandas.length) {
        await newMenu
          .save()
          .then((result) => {
            res.json({ result });
          })
          .catch((err) => {
            // res.status(500).json({ err });
            throw err;
          });
      } else {
        return res.status(500).send({
          error_message: `Alguna vianda es inexistente. Error: ${err}`,
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

export const findOneMenu = async (req, res, next) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        error_message: `The menu with id ${id} does not exists.`,
      });
    }

    res.json(menu);
  } catch (err) {
    next(err);
  }
};

export const findAllActiveMenus = async (req, res, next) => {
  try {
    const activeMenus = await Menu.find({ active: true }).populate('viandas');
    res.json({activeMenus});
  } catch (err) {
    next(err);
  }
 
};

export const updateMenu = async (req, res, next) => {
    const id = req.params.id;
    try {
      const updatedMenu = await Menu.findByIdAndUpdate(id, req.body);

      if (!updatedMenu) {
        return res.status(404).json({
          error_message: `The menu with id: ${id} does not exists.`,
        });
      }
      res.json({
        message: `Menu ${id} updated.`,
      });
    } catch (err) {
      next(err);
    }
  };

export const deleteMenu = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({
        error_message: `The menu with id: ${id} does not exists.`,
      });
    }
    res.json({
      message: `Menu with id: ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};
