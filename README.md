# NodeManager — Full-Stack Web Application

A full-stack Node.js + React.js + MongoDB application implementing user authentication with role-based access control (RBAC) and complete CRUD operations for a "Node" resource.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, React Router v6, Axios                |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB, Mongoose ODM                           |
| Auth      | JSON Web Tokens (JWT), bcryptjs                 |
| Security  | Helmet, express-rate-limit, express-mongo-sanitize, express-validator |

---

## Project Structure

```
project/
├── backend/
│   ├── server.js                  # Entry point
│   ├── seed.js                    # Database seeder
│   ├── .env.example
│   └── src/
│       ├── app.js                 # Express app setup
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── node.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js  # JWT protect + restrictTo
│       │   ├── errorHandler.js
│       │   ├── notFound.js
│       │   └── validate.middleware.js
│       ├── models/
│       │   ├── User.model.js
│       │   └── Node.model.js
│       ├── routes/v1/
│       │   ├── auth.routes.js
│       │   ├── node.routes.js
│       │   └── user.routes.js
│       ├── utils/
│       │   ├── jwt.utils.js
│       │   └── apiResponse.utils.js
│       └── validators/
│           ├── auth.validators.js
│           └── node.validators.js
│
└── frontend/
    └── src/
        ├── App.jsx                # Root component with routing
        ├── index.js
        ├── api/                   # Axios client + API service modules
        │   ├── client.js
        │   ├── auth.api.js
        │   ├── nodes.api.js
        │   └── users.api.js
        ├── context/
        │   └── AuthContext.jsx    # Global auth state via React Context
        ├── hooks/
        │   └── useNodes.js        # Node CRUD logic in a reusable hook
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   └── ProtectedRoute.jsx
        │   └── nodes/
        │       ├── NodeCard.jsx
        │       └── NodeForm.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── NodesPage.jsx
            └── AdminUsersPage.jsx
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally (default: `mongodb://localhost:27017`) or a MongoDB Atlas URI

---

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

# (Optional) Seed the database with demo data
node seed.js

# Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will start at `http://localhost:3000` and proxy API requests to port 5000.

---

### Demo Credentials (after seeding)

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@example.com   | admin123  |
| User  | user@example.com    | user123   |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Access  | Description          |
|--------|-----------------|---------|----------------------|
| POST   | /auth/register  | Public  | Register new user    |
| POST   | /auth/login     | Public  | Login and get token  |
| GET    | /auth/me        | Auth    | Get current user     |

### Nodes (CRUD)

| Method | Endpoint     | Access     | Description             |
|--------|-------------|------------|-------------------------|
| GET    | /nodes      | Auth       | List nodes (paginated)  |
| POST   | /nodes      | Auth       | Create a node           |
| GET    | /nodes/:id  | Auth       | Get a single node       |
| PATCH  | /nodes/:id  | Auth/Owner | Update a node           |
| DELETE | /nodes/:id  | Auth/Owner | Delete a node           |

**Note:** Admin users can access and modify all nodes. Regular users can only manage their own.

### Users (Admin Only)

| Method | Endpoint            | Access | Description          |
|--------|--------------------|----|----------------------|
| GET    | /users             | Admin | List all users       |
| PATCH  | /users/:id/role    | Admin | Change a user's role |
| DELETE | /users/:id         | Admin | Delete a user        |

---

## Security Measures

- **Password hashing** — bcryptjs with salt rounds of 12
- **JWT authentication** — signed tokens with configurable expiry
- **Input validation** — express-validator on all POST/PATCH routes
- **NoSQL injection prevention** — express-mongo-sanitize
- **HTTP security headers** — Helmet.js
- **Rate limiting** — 100 requests per 15 minutes per IP
- **Role-based access control** — middleware-enforced at route level

---

## Role-Based Access Control

| Feature               | User | Admin |
|-----------------------|------|-------|
| Register / Login      | ✓    | ✓     |
| View own nodes        | ✓    | ✓     |
| View all nodes        | ✗    | ✓     |
| Create/edit/delete own nodes | ✓ | ✓   |
| Edit/delete any node  | ✗    | ✓     |
| Access user management | ✗   | ✓     |

---

## Query Parameters (GET /nodes)

| Param   | Type   | Example        | Description            |
|---------|--------|----------------|------------------------|
| page    | number | `?page=2`      | Pagination page        |
| limit   | number | `?limit=10`    | Items per page (max 50)|
| status  | string | `?status=active` | Filter by status     |
| search  | string | `?search=api`  | Search name/description|
