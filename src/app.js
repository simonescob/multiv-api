import express from 'express'
import './database'
import productRoutes from './routes/products.routes'
import ingredientsRoutes from './routes/ingredients.routes'
import menusRoutes from './routes/menus.routes'
import kitchenOrdersRoutes from './routes/kitchen.orders.routes'
import deliveryOrdersRoutes from './routes/delivery.orders.routes'
import usersRoutes from './routes/users.routes'
import profilesRoutes from './routes/profiles.routes'
import authRoutes from './routes/auth.routes'
import morgan from 'morgan'
import ordersRoutes from './routes/orders.routes'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy } from './strategies/passport.js'

import cors from 'cors'
import { logErrors, wrapErrors, errorHandler } from './middlewares/error.handler'
import notFoundHandler from './middlewares/notFound.handler'

const app = express()

// middlewares
const corsOptions = {}
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

passport.use(Strategy)

// for cookies
app.use(cookieParser())

// statics
// eslint-disable-next-line n/no-path-concat
app.use('/api/public/uploads', express.static(__dirname + '/public/uploads'))

// routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to multiv-api' })
})

// Rutas sin autenticar
app.use('/api/ingredients', ingredientsRoutes)
app.use('/api/products', productRoutes)
app.use('/api/menus', menusRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/kitchen/orders', kitchenOrdersRoutes)
app.use('/api/delivery/orders', deliveryOrdersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/auth', authRoutes)

// // Rutas autenticadas
// app.use('/api/ingredients', passport.authenticate('jwt', { session: false }), ingredientsRoutes)
// app.use('/api/products', passport.authenticate('jwt', { session: false }), productRoutes)
// app.use('/api/menus', passport.authenticate('jwt', { session: false }), menusRoutes)
// app.use('/api/orders', passport.authenticate('jwt', { session: false }), ordersRoutes)
// app.use('/api/kitchen/orders', passport.authenticate('jwt', { session: false }), kitchenOrdersRoutes)
// app.use('/api/delivery/orders', passport.authenticate('jwt', { session: false }), deliveryOrdersRoutes)
// app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRoutes)
// app.use('/api/profiles', passport.authenticate('jwt', { session: false }), profilesRoutes)
// app.use('/api/auth', authRoutes)

// app.use('/api/users',
//   passport.authenticate('jwt', { session: false }),
//   checkRoles('admin'),
//   usersRoutes);

// auth routes
// app.use(verifyJwt);

// Catch 404
app.use(notFoundHandler)

// error handlers middlewares
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

export default app
