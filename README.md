# MultiV API

A REST API built with Node.js, Express, and MongoDB for managing restaurant operations including products, ingredients, menus, orders, and users.

## Features

- **Authentication & Authorization** with JWT and Passport.js
- **RESTful API** with Express.js
- **MongoDB Database** with Mongoose ODM
- **File Upload** support with Multer
- **Validation** with Yup schemas
- **Error Handling** with custom middleware
- **CORS Support** for cross-origin requests
- **Docker Support** for easy deployment

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB 6.0
- **Authentication**: Passport.js, JWT
- **Validation**: Yup
- **Build Tools**: Babel, Nodemon (development)
- **Containerization**: Docker & Docker Compose

## Prerequisites

Before running this project, make sure you have installed:

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** (for containerized deployment)

## Quick Start

### Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multiv-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (ensure MongoDB is running locally or update connection settings in .env)

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

### Docker Deployment

#### Development with Docker

1. **Start the entire stack**
   ```bash
   npm run docker:dev
   ```

   Or manually:
   ```bash
   docker-compose up --build
   ```

2. **Access the services**
   - **API**: http://localhost:3000/api
   - **MongoDB Express UI**: http://localhost:8081 (admin/admin)
   - **MongoDB**: localhost:27017

3. **Available Docker commands**
   ```bash
   # View logs
   npm run docker:logs
   
   # Stop containers
   npm run docker:down
   
   # Clean up (removes volumes)
   npm run docker:clean
   
   # Access MongoDB shell
   npm run docker:mongo
   ```

#### Production Deployment

1. **Environment Setup**
   ```bash
   cp .env.production .env
   # Edit .env with production values
   ```

2. **Generate secure secrets**
   ```bash
   openssl rand -base64 64
   # Use the output for JWT_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
   ```

3. **Deploy to production**
   ```bash
   npm run docker:prod
   ```

   Or manually:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

## API Endpoints

### Public Endpoints
- `GET /api` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints
- `GET /api/users` - Get users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/products` - Get products
- `POST /api/products` - Create product (admin only)
- `GET /api/ingredients` - Get ingredients
- `POST /api/ingredients` - Create ingredient (admin only)
- `GET /api/menus` - Get menus
- `POST /api/menus` - Create menu (admin only)
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/kitchen/orders` - Get kitchen orders
- `POST /api/kitchen/orders` - Create kitchen order
- `GET /api/delivery/orders` - Get delivery orders
- `POST /api/delivery/orders` - Create delivery order

## Environment Variables

| Variable | Description | Default/Required |
|----------|-------------|------------------|
| `NODE_ENV` | Environment mode | development/production |
| `PORT` | Server port | 3000 |
| `CORS` | Allowed CORS origins | http://localhost:3000 |
| `DB_USER` | MongoDB username | admin |
| `DB_PASSWORD` | MongoDB password | password |
| `DB_HOST` | MongoDB host | localhost/mongodb |
| `DB_NAME` | Database name | multiv_api |
| `JWT_SECRET` | JWT signing secret | Required (generate securely) |
| `ACCESS_TOKEN_SECRET` | Access token secret | Required (generate securely) |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Required (generate securely) |

## Docker Architecture

### Development Stack
- **Application**: Node.js with hot reload
- **Database**: MongoDB 6.0
- **Admin UI**: MongoDB Express
- **Port mapping**: 3000 (API), 27017 (MongoDB), 8081 (MongoDB Express)

### Production Stack
- **Application**: Node.js production build
- **Database**: MongoDB 6.0
- **Reverse Proxy**: Nginx (optional)
- **Health Checks**: Built-in container health monitoring

## Development Workflow

### Running Tests
```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Operations
```bash
# Connect to MongoDB shell (Docker)
npm run docker:mongo

# Connect to MongoDB (local)
mongodb://localhost:27017/multiv_api
```

### Docker Development
```bash
# Rebuild and start services
docker-compose up --build

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f mongodb

# Restart specific service
docker-compose restart app
```

## Security Considerations

### Production Security
1. **Change default passwords** in production
2. **Generate strong JWT secrets** (minimum 32 characters)
3. **Use environment-specific CORS origins**
4. **Enable MongoDB authentication**
5. **Consider using external MongoDB service** (Atlas, etc.)
6. **Implement HTTPS** with SSL certificates
7. **Set up proper firewall rules**

### JWT Secret Generation
```bash
# Generate secure secrets
openssl rand -base64 64

# Use each output for:
# - JWT_SECRET
# - ACCESS_TOKEN_SECRET  
# - REFRESH_TOKEN_SECRET
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change PORT in .env file or stop other services
   lsof -i :3000
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB is running
   docker-compose logs mongodb
   
   # Verify connection string in .env
   ```

3. **Docker build issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Environment variables not loading**
   ```bash
   # Ensure .env file exists and has correct format
   # Restart services after changes
   ```

### Logs and Debugging

```bash
# View application logs
npm run docker:logs

# Access container shell
docker exec -it multiv-api-app sh

# Check MongoDB logs
docker logs multiv-api-mongodb

# Monitor resource usage
docker stats
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License