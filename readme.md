# Clarity Project

A full-stack personal finance management application that helps users track their income and expenses with an intuitive dashboard interface.

## 📋 Overview

Clarity is a modern web application designed for managing personal transactions. Users can register, log in, and maintain a detailed record of their financial activities with categorized income and expense tracking.

## Deployement Platform
 - **Frontend** - Vercel
 - **Database** - Railway
 - **Backend** - Railway
  

## 🚀 Tech Stack

### Frontend
- **React 19.2** - UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## ✨ Features

### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Password encryption using bcryptjs
- Protected routes requiring authentication

### Transaction Management
- Add income and expense transactions
- Categorize transactions for better organization
- Add descriptions and dates to transactions
- View all transactions in a dashboard
- Real-time transaction updates

### Dashboard
- Visual overview of financial data
- Transaction history listing
- User-specific data isolation
- Responsive design for all devices

## 📁 Project Structure

```
clarity-project/
├── backend/
│   ├── server.js          # Express server configuration
│   ├── db.js              # PostgreSQL database setup
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   └── routes/
│       ├── auth.js        # Authentication endpoints
│       └── transactions.js # Transaction CRUD operations
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable React components
    │   │   ├── Dashboard.tsx
    │   │   ├── LoginForm.tsx
    │   │   ├── SignupForm.tsx
    │   │   ├── TransactionForm.tsx
    │   │   └── TransactionList.tsx
    │   ├── context/       # React Context for state management
    │   │   └── AuthContext.tsx
    │   ├── pages/         # Page-level components
    │   │   ├── DashboardPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   └── SignupPage.tsx
    │   ├── services/      # API integration
    │   │   └── api.ts
    │   └── types/         # TypeScript type definitions
    └── vite.config.ts     # Vite configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/clarity_db
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

4. Start the server:
```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🗄️ Database Schema

### Users Table
- `id` - Serial primary key
- `email` - Unique user email
- `password` - Hashed password
- `created_at` - Account creation timestamp

### Transactions Table
- `id` - Serial primary key
- `user_id` - Foreign key to users table
- `type` - Transaction type (income/expense)
- `amount` - Transaction amount (decimal)
- `category` - Transaction category
- `description` - Optional details
- `date` - Transaction date
- `created_at` - Record creation timestamp

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Environment variable configuration
- Secure database queries with parameterized statements

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Health Check
- `GET /api/health` - Server status check


