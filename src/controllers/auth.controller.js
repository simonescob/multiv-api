import jwt from 'jsonwebtoken'
import boom from '@hapi/boom'
import { config } from '../config'
import User from '../models/User'

export const handleLogin = async (req, res, next) => {
    try {
        let user = req.user
        const payload = {
            sub: user._id,
            role: user.role
        }

        const accessToken = jwt.sign(
            payload,
            config.accessTokenSecret,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            payload,
            config.refreshTokenSecret,
            { expiresIn: '1d' }
        )

        //guardo en bbdd el refresh token 
        const userUpdated = await User.findByIdAndUpdate(user._id, { refreshToken }).exec()
        if (!userUpdated) {
            return next(boom.notImplemented(`The refresh token cant be saved to ${user._id} user.`))

        } else {
            console.log(`User with id ${user._id} is logged in!`)

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: "None",
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({
                // user,
                accessToken
            })

        }


    } catch (err) {
        next(err)
    }

}

export const handleRefreshToken = async (req, res, next) => {


    try {
        const cookies = req.cookies

        console.log(cookies)

        if (!cookies?.jwt) return next(boom.unauthorized('No hay token'))

        const refreshToken = cookies.jwt

        //search user for refreshtoken
        const foundUser = await User.findOne({ refreshToken })

        if (!foundUser) return next(boom.unauthorized('No autorizado'))

        jwt.verify(
            refreshToken,
            config.refreshTokenSecret,
            (error, decoded) => {

                if (error || foundUser._id != decoded.sub) return next(boom.forbidden('no coinciden ids'))

                const payload = {
                    sub: decoded.sub,
                    role: decoded.role
                }

                const accessToken = jwt.sign(
                    payload,
                    config.accessTokenSecret,
                    { expiresIn: '15m' }
                )

                res.json({
                    accessToken
                })


            }
        )



    }
    catch (err) {
        next(err)
    }


}

export const handleLogout = async (req, res, next) => {

    try {

        const cookies = req.cookies

        if (!cookies?.jwt) return next(boom.badRequest('your are logout now.'))
        const refreshToken = cookies.jwt

        //foundUser
        const foundUser = await User.findOne({ refreshToken })

        if (!foundUser) {
            //limpio cookie
            res.clearCookie('jwt', {
                httpOnly: true, 
                sameSite: "None",
                // secure: true
            })

            return next(boom.badRequest('No hay cookie'))

        } else {

            //borro refreshtoken
            foundUser.refreshToken = undefined
            //guardo en bbdd
            foundUser.save()
            //limpio cookie
            res.clearCookie('jwt', {
                httpOnly: true, 
                sameSite: "None",
                // secure: true
            })

            console.log(`User with id ${foundUser.username} is logged out!`)
            
            res.json({
                message: `${foundUser.username} is logged out!`,
            });

        }
    } catch (error) {
        next(error)
    }

}