# 🛒 E-Commerce Backend API

A robust, scalable Node.js backend API for e-commerce applications built with Express.js, Prisma ORM, and JWT authentication.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 👥 **User Management** - User registration, login, and role-based access control
- 📦 **Product Management** - CRUD operations for products with categories
- 🛍️ **Shopping Cart** - Add, update, remove items, and view cart contents
- 📋 **Order Management** - Create and manage customer orders
- 💳 **Payment Integration** - Payment processing endpoints
- 🗄️ **Database** - SQLite with Prisma ORM for development
- 🔒 **Security** - Helmet.js, input validation, and error handling
- 📚 **API Documentation** - OpenAPI/Swagger specification

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed:admin
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## 📁 Project Structure

```
ecommerce-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware functions
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── prisma/              # Database schema and migrations
├── scripts/             # Database seeding scripts
├── tests/               # Test files
└── docs/                # API documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-super-secret-key-here"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

### Database Schema

The project uses Prisma ORM with SQLite for development. Key models include:

- **User** - Authentication and user management
- **Product** - Product catalog
- **Category** - Product categorization
- **Cart** - Shopping cart management
- **CartItem** - Individual items in cart
- **Order** - Customer orders
- **OrderItem** - Items within orders

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin only)

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment details

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **USER** - Basic user permissions
- **ADMIN** - Full access to all endpoints

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📊 Database Seeding

Seed the database with initial data:

```bash
# Create admin user
npm run seed:admin

# Run all seeders (if available)
npm run seed:all
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Configure production database URL
- Set up proper logging and monitoring

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed:admin` - Seed admin user

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations

## 🔮 Roadmap

- [ ] Add product image uploads
- [ ] Implement email notifications
- [ ] Add payment gateway integrations
- [ ] Create admin dashboard
- [ ] Add product reviews and ratings
- [ ] Implement inventory management
- [ ] Add analytics and reporting

---

**Built with ❤️ using Node.js, Express, and Prisma**
