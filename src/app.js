import express from 'express';
import './database';
import viandasRoutes from './routes/viandas.routes';
import ingredientsRoutes from './routes/ingredients.routes';
import menusRoutes from './routes/menus.routes';
import ordersRoutes from './routes/orders.routes';
import plansRoutes from './routes/plans.routes';
import usersRoutes from './routes/users.routes';
import customersRoutes from './routes/customers.routes';
import authRoutes from './routes/auth.routes';
import morgan from 'morgan';
import passport from 'passport';
import { checkApiKey, checkRoles } from './middlewares/auth.handler';

import cors from 'cors';
import {
  logErrors,
  wrapErrors,
  errorHandler,
} from './middlewares/error.handler';
import notFoundHandler from './middlewares/notFound.handler';

const app = express();

//middlewares
const corsOptions = {};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('./utils/auth')

//routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to multiv-api' });
});
app.use('/api/viandas', viandasRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/users',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/auth', authRoutes);


//statics
app.use('/api/public/uploads', express.static(__dirname + '/public/uploads'));


//Catch 404
app.use(notFoundHandler);

// error handlers middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);


export default app;
