import { config } from '../config'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const jwtSecret = config.jwtSecret

export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username && !email) {
      return res.status(400).json({ error: 'Se requiere nombre de usuario o correo electrónico.' })
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (!user) {
      return res.status(401).json({ error: 'El Usuario no existe.' })
    }
    console.log('user: ', user)

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'La contraseña no es correcta.' })
    }
    const authToken = jwt.sign({ sub: user.id, role: user.role, username: user.username }, jwtSecret, { expiresIn: '1d' })
    const refreshToken = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' })
    const loguedUser = { ...user._doc }
    delete loguedUser.hashedPassword
    delete loguedUser.verificationCode
    delete loguedUser.verificationCodeExpiresAt

    res.json({ authToken, refreshToken, user: loguedUser })
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error en el proceso' })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken

    jwt.verify(refreshToken, jwtSecret, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Token de refresco inválido' })
      }
      const user = await User.findById(decoded.sub)
      if (!user) {
        return res.status(401).json({ error: 'El usuario no existe' })
      }
      const authToken = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '1d' })
      const loguedUser = { ...user._doc }
      delete loguedUser.hashedPassword

      res.json({ authToken, user: loguedUser })
    })
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error en el procedimiento de refrescar token' })
  }
}
