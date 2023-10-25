import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User.js'
import { config } from '../config.js'

const jwtSecret = config.jwtSecret

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

export const Strategy = new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.sub)
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
})
