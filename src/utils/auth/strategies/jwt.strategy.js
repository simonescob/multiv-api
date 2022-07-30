const { Strategy, ExtractJwt } = require('passport-jwt')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const { config } = require('../../../config')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.accessTokenSecret   
}


const jwtStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload)
} )

module.exports = jwtStrategy