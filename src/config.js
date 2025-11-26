// Load environment variables based on NODE_ENV
// Default to .env, but load .env.production if NODE_ENV=production
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' })
} else {
  require('dotenv').config()
}

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}

module.exports = { config }
