const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
import {findByUsername} from '../../../controllers/user.controller';

const LocalStrategy = new Strategy(async (username, password, done) => {

    try {

        const user = await findByUsername(username)
        if (!user) {
            // console.log('no hay user con ese username')
            return done(boom.unauthorized(), false)
        }
        
        // console.log(user.password)
        // console.log(password)

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            // console.log('nocoincide el password')
            return done(boom.unauthorized(), false)
        }

        //borro password antes de retornar
        user.password = undefined

        return done(null, user)

    } catch (err) {
        return done(err, false)
    }


})

module.exports = LocalStrategy

