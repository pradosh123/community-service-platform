# Community Service Platform - Backend API

A robust, enterprise-grade Node.js backend API built with Express.js and MongoDB for the Community Service Platform.

## 🚀 Features

- **RESTful API** - Well-structured REST endpoints
- **MongoDB Integration** - Supports both local MongoDB and MongoDB Atlas
- **Swagger Documentation** - Interactive API documentation
- **Authentication & Authorization** - JWT-based auth system
- **Error Handling** - Centralized error handling middleware
- **Rate Limiting** - Protection against abuse
- **Security** - Helmet.js for security headers
- **Environment Configuration** - Environment-based configuration
- **Migration Scripts** - Database migration support

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd community-service-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/?authSource=admin
   MONGODB_DB_NAME=community_service_platform
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB** (if using local instance)
   Ensure MongoDB is running on your local machine

5. **Run migrations** (optional)
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

Once the server is running, access the Swagger API documentation at:

**http://localhost:3000/api-docs**

## 🔌 API Endpoints

### Categories

**Note:** You need to create a category first before registering workers, as workers require a valid category ID.

#### Create a Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Plumbing",
  "description": "Plumbing services",
  "icon": "fa-wrench"
}
```

#### List Categories
```http
GET /api/categories
```

#### Get Category by ID
```http
GET /api/categories/:id
```

### Workers

#### Register a Worker
```http
POST /api/workers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "category": "507f1f77bcf86cd799439011",
  "skills": ["Plumbing", "Electrical"],
  "experience": 5,
  "hourlyRate": 50,
  "availability": "full-time"
}
```

**Important:** The `category` field must be a valid MongoDB ObjectId of an existing category. If you get an error about invalid category, first create a category using `/api/categories` endpoint and use its `_id` value.

#### List Workers
```http
GET /api/workers?page=1&limit=10&status=approved&city=New York
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, approved, rejected, suspended)
- `category` - Filter by category ID
- `city` - Filter by city
- `state` - Filter by state
- `availability` - Filter by availability (full-time, part-time, on-demand)
- `minRating` - Minimum rating
- `isActive` - Filter by active status (true/false)
- `search` - Search in name, email, or phone

#### Get Worker by ID
```http
GET /api/workers/:id
```

#### Update Worker
```http
PUT /api/workers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "hourlyRate": 55,
  "status": "approved"
}
```

#### Delete Worker
```http
DELETE /api/workers/:id
Authorization: Bearer <token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   │
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── s3.js              # AWS S3 configuration
│   │   └── whatsapp.js        # WhatsApp configuration
│   │
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── worker.routes.js   # Worker routes
│   │   ├── job.routes.js      # Job routes
│   │   ├── admin.routes.js    # Admin routes
│   │   └── category.routes.js # Category routes
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── worker.controller.js
│   │   ├── job.controller.js
│   │   ├── admin.controller.js
│   │   └── category.controller.js
│   │
│   ├── services/
│   │   ├── notification.service.js
│   │   ├── whatsapp.service.js
│   │   └── sms.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── worker.model.js
│   │
│   └── migrations/
│       └── migrate.js         # Migration scripts
│
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `MONGODB_DB_NAME` | Database name | community_service_platform |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `AWS_ACCESS_KEY_ID` | AWS access key (for S3) | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |
| `AWS_REGION` | AWS region | us-east-1 |
| `S3_BUCKET_NAME` | S3 bucket name | - |
| `WHATSAPP_API_URL` | WhatsApp API URL | - |
| `WHATSAPP_API_KEY` | WhatsApp API key | - |
| `SMS_API_URL` | SMS API URL | - |
| `SMS_API_KEY` | SMS API key | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🔧 Scripts

- `npm start` - Start the server
- `npm run dev` - Start server in development mode with auto-reload
- `npm run migrate` - Run database migrations
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 📝 MongoDB Setup

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env` with your connection string:
   ```env
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/?authSource=admin
   ```

### MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## 🧪 Testing API

You can test the API using:

1. **Swagger UI** - http://localhost:3000/api-docs
2. **Postman** - Import the endpoints
3. **curl** - Command line tool

Example curl request:
```bash
curl -X POST http://localhost:3000/api/workers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "address": {
      "city": "New York",
      "state": "NY"
    },
    "category": "507f1f77bcf86cd799439011",
    "hourlyRate": 50
  }'
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong JWT secrets** in production
3. **Enable HTTPS** in production
4. **Regularly update dependencies**
5. **Use rate limiting** (already configured)
6. **Validate all inputs** (using express-validator)
7. **Sanitize user inputs**

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables

### Security & Middleware
- `helmet` - Security headers
- `cors` - CORS support
- `express-rate-limit` - Rate limiting
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Documentation
- `swagger-jsdoc` - Swagger documentation
- `swagger-ui-express` - Swagger UI

### Utilities
- `morgan` - HTTP request logger
- `express-validator` - Input validation

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure MongoDB credentials are correct
- Check firewall settings

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change PORT in .env
```

## 📄 License

See LICENSE file in the root directory.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.

