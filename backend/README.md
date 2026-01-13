# Pass Storage Backend API

Express.js backend for Pass Storage application with MongoDB integration.

## Features

- User authentication (Register/Login) with JWT
- Password management (CRUD operations)
- MongoDB database integration
- Secure password hashing with bcrypt
- JWT token-based authentication
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
DB_NAME=Pass_storage
JWT_SECRET=your-secret-key-change-in-production
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "token": "...", "user": {...} }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "token": "...", "user": {...} }`

- `GET /api/auth/verify` - Verify JWT token (requires Authorization header)

### Passwords (All require authentication)

- `GET /api/passwords` - Get all passwords for authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "passwords": [...] }`

- `POST /api/passwords` - Create a new password
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "site": "example.com", "username": "user", "password": "pass123" }`
  - Returns: `{ "message": "...", "password": {...} }`

- `PUT /api/passwords/:id` - Update a password
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "site": "example.com", "username": "user", "password": "pass123" }`

- `DELETE /api/passwords/:id` - Delete a password
  - Headers: `Authorization: Bearer <token>`

- `GET /api/passwords/count` - Get password count
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "count": 5, "max": 10 }`

## Database Collections

- **users**: Stores user accounts
  - `email` (string, unique)
  - `password` (hashed string)
  - `createdAt` (date)

- **passwords**: Stores user passwords
  - `userId` (string, reference to user)
  - `site` (string)
  - `username` (string)
  - `password` (string)
  - `createdAt` (date)
  - `updatedAt` (date, optional)

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- All password routes require authentication
- Maximum 10 passwords per user
- CORS enabled for frontend integration
