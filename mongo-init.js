// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the target database
db = db.getSiblingDB('multiv_api');

// Create the application user with read/write permissions
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'multiv_api'
    }
  ]
});

// Create collections with validation schemas (optional)
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'Email is required and must be a string'
        },
        password: {
          bsonType: 'string',
          description: 'Password is required and must be a string'
        },
        name: {
          bsonType: 'string',
          description: 'Name is required and must be a string'
        },
        role: {
          enum: ['admin', 'user', 'kitchen', 'delivery'],
          description: 'Role must be one of the specified values'
        }
      }
    }
  }
});

print('MongoDB initialization completed successfully!');
print('Database: multiv_api');
print('User: admin');
print('Password: password');