import jwt from 'jsonwebtoken'
// import passport from 'passport'
import boom from '@hapi/boom'
import { config } from '../config'

// export const checkApiKey = (req, res, next) => {
//     const apiKey = req.headers['api']
//     if (apiKey === config.apiKey) {
//         next()
//     } else {
//         next(boom.unauthorized())
//     }
// }

// export const checkAdminRole = (req, res, next) => {
//     const user = req.user
//     if (user.role === 'admin') {
//         next()
//     } else {
//         next(boom.unauthorized())
//     }
// }

export const checkRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user
    if (roles.includes(user.role)) {
      next()
    } else {
      next(boom.unauthorized())
    }
  }
}

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.cookie

  console.log(authHeader)

  if (!authHeader) return next(boom.unauthorized())

  const token = authHeader.split(' ')[1]

  jwt.verify(token, config.accessTokenSecret, (error, decoded) => {
    if (error) return next(boom.forbidden())

    next()
  })
}
