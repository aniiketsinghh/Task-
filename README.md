# NodeManager — Full-Stack Web Application

A full-stack Node.js + React.js + MongoDB application implementing user authentication with role-based access control (RBAC) and complete CRUD operations for a "Node" resource.

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

### Backend Setup
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
