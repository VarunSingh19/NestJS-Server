# 📚 NestJS Course Management Backend

A RESTful API server built with **NestJS** for managing courses with user authentication and authorization. Users can register, log in, and perform full CRUD operations on courses — with ownership-based access control ensuring only course creators can modify or delete their own content.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [NestJS](https://nestjs.com/) v11 | Backend framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Mongoose](https://mongoosejs.com/) v9 | MongoDB ODM |
| [JWT](https://jwt.io/) (`@nestjs/jwt`) | Token-based authentication |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Password hashing |
| [class-validator](https://github.com/typestack/class-validator) | Request DTO validation |
| [class-transformer](https://github.com/typestack/class-transformer) | DTO transformation |
| TypeScript | Language |
| pnpm | Package manager |

---

## 📂 Project Structure

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
│
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts     # Register, Login, Profile endpoints
│   ├── auth.service.ts        # Auth business logic (hashing, JWT)
│   ├── auth.guard.ts          # JWT-based route guard
│   ├── constants.ts
│   └── dto/
│       └── registerUser.dto.ts  # RegisterDto & loginDto
│
├── user/                      # User module
│   ├── user.module.ts
│   ├── user.service.ts        # User CRUD operations
│   ├── user.types.ts          # User role enums
│   └── schemas/
│       └── user.schema.ts     # Mongoose User schema
│
└── course/                    # Course module
    ├── course.module.ts
    ├── course.controller.ts   # Course CRUD endpoints
    ├── course.service.ts      # Course business logic
    ├── dto/
    │   ├── create-course.dto.ts  # CreateCourseDto
    │   └── update-course.dto.ts  # UpdateCourseDto (partial)
    └── schemas/
        └── course.schema.ts   # Mongoose Course schema
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or a cloud URI)
- **pnpm** (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd NestJs-Backend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/nest-backend
JWT_SECRET=your-secret-key
```

### Running the Server

```bash
# Development (watch mode)
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

The server starts at `http://localhost:3000` by default.

---

## 📡 API Endpoints

### 🔐 Authentication — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Log in and receive a JWT |
| `GET` | `/auth/profile` | ✅ | Get the authenticated user's profile |

#### `POST /auth/register`

```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `GET /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "60f7...",
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com"
}
```

---

### 📚 Courses — `/course`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/course` | ✅ | Create a new course |
| `GET` | `/course` | ❌ | Get all courses |
| `GET` | `/course/:id` | ❌ | Get a course by ID |
| `PATCH` | `/course/:id` | ✅ | Update a course (owner only) |
| `DELETE` | `/course/:id` | ✅ | Delete a course (owner only) |

#### `POST /course`

**Headers:** `Authorization: Bearer <token>`

```json
{
  "name": "Introduction to NestJS",
  "description": "Learn the fundamentals of NestJS framework",
  "level": "Beginner",
  "price": 499
}
```

#### `PATCH /course/:id`

**Headers:** `Authorization: Bearer <token>`

```json
{
  "price": 399
}
```

> **Note:** Only the user who created the course can update or delete it.

---

## 🔒 Authentication Flow

1. **Register** → Password is hashed with `bcrypt` (10 salt rounds) → User stored in MongoDB → JWT issued
2. **Login** → Credentials verified against DB → JWT issued
3. **Protected Routes** → `AuthGuard` extracts and verifies the Bearer token → Attaches user payload (`sub`, `fname`, `lname`, `email`) to the request object

---

## 🧪 Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Test coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start the server |
| `pnpm start:dev` | Start in watch mode (development) |
| `pnpm start:debug` | Start in debug mode |
| `pnpm start:prod` | Start the production build |
| `pnpm build` | Build the project |
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run unit tests |

---

## 📄 License

This project is [UNLICENSED](LICENSE).
