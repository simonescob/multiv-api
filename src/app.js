import express from 'express';
import viandasRoutes from './routes/viandas.routes';
//import morgan from 'morgan';

import cors from 'cors';
import {
  logErrors,
  wrapErrors,
  errorHandler,
} from './utils/middlewares/errorHandlers';
import notFoundHandler from './utils/middlewares/notFoundHandler';

const app = express();

//middlewares
const corsOptions = {};
app.use(cors(corsOptions));
// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my app' });
});
app.use('/api/viandas', viandasRoutes);

//Catch 404
app.use(notFoundHandler);

// error handlers middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

export default app;
