# First Base

A full-stack dating and social-networking app where users discover people, build connections, message each other, and plan date nights together.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Seed](#database-seed)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Feature | Description |
|---|---|
| **Account management** | Sign up and log in with email and password |
| **Profile** | Set your name, age, bio, interests, favourite shows, social media handles, and preferred age range |
| **Discovery** | Browse users who are not yet connected to you |
| **Connections** | Send, accept, or decline connection requests; remove existing connections |
| **Messaging** | Real-time-style direct messaging — only available between confirmed connections |
| **Date ideas** | Save and organise personal date-night ideas locally |
| **Tiers** | Free plan available; Pro plan (AI date coach, voice assistant, priority visibility) coming soon |

---

## Tech Stack

**Backend**

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web framework | Express 4 |
| API | GraphQL via Apollo Server 4 |
| Database | MongoDB with Mongoose 8 |
| Authentication | JWT stored in `httpOnly` cookies |
| Password hashing | bcryptjs |

**Frontend**

| Layer | Technology |
|---|---|
| UI library | React 18 |
| Build tool | Vite 6 |
| GraphQL client | Apollo Client 3 |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Styling | Tailwind CSS 3 |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A running **MongoDB** instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd firstbaseapp

# Install all dependencies (server + client) in one step
npm run install
```

### Environment Variables

Create a `.env` file inside the `server/` directory. Use `server/.env.example` as a template:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/firstbaseapp
JWT_SECRET=replace_with_a_long_random_secret   # required — server will not start without this
PORT=3001
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> **`JWT_SECRET` is required.** The server throws an error at startup if it is missing or empty. Generate a strong value with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Database Seed

Populate the database with sample users:

```bash
npm run seed
```

---

## Running the App

### Development

Starts the Express server (with auto-reload via nodemon) and the Vite dev server concurrently:

```bash
npm run develop
```

- Client: [http://localhost:3000](http://localhost:3000)
- GraphQL sandbox: [http://localhost:3001/graphql](http://localhost:3001/graphql)

### Production

Build the client, then start the server (which serves the built assets):

```bash
npm run build
npm start
```

---

## Project Structure

```
firstbaseapp/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Nav, Contact, shared UI
│       ├── pages/           # Home, Login, Signup, UserandDate, About
│       ├── utils/
│       │   ├── auth.js      # Cookie-based auth helpers
│       │   ├── mutations.js # Apollo mutation definitions
│       │   └── queries.js   # Apollo query definitions
│       └── index.jsx        # Apollo Client setup (credentials: include)
│
└── server/                  # Express + Apollo Server backend
    ├── config/
    │   └── connection.js    # Mongoose connection
    ├── models/
    │   └── User.js          # User schema and password hashing
    ├── schemas/
    │   ├── typeDefs.js      # GraphQL type definitions
    │   └── resolvers.js     # Query and Mutation resolvers
    ├── utils/
    │   └── auth.js          # JWT sign/verify; fails fast if JWT_SECRET unset
    ├── seeders/seed.js
    └── server.js            # Express app, Apollo middleware, /logout endpoint
```

---

## API Overview

All data is fetched through a single GraphQL endpoint at `/graphql`.

### Queries

| Query | Auth required | Description |
|---|---|---|
| `me` | Yes | Returns the logged-in user's full profile |
| `discoverUsers` | Yes | Returns users not yet connected to the current user |
| `getConversation(userId)` | Yes | Returns the message thread with a specific user |

### Mutations

| Mutation | Auth required | Description |
|---|---|---|
| `addUser(email, password)` | No | Creates an account and opens a session |
| `login(email, password)` | No | Authenticates and opens a session |
| `updateProfile(...)` | Yes | Updates profile fields |
| `sendRequest(userId)` | Yes | Sends a connection request |
| `acceptRequest(userId)` | Yes | Accepts a pending request |
| `declineRequest(userId)` | Yes | Declines a pending request |
| `removeConnection(userId)` | Yes | Removes an existing connection |
| `sendMessage(recipientId, content)` | Yes | Sends a message to a connection |

### REST

| Method | Path | Description |
|---|---|---|
| `POST` | `/logout` | Clears auth cookies and ends the session |

---

## Security

- **`httpOnly` cookies** — The JWT is stored in an `httpOnly`, `SameSite=Strict` cookie. JavaScript cannot read it, limiting the blast radius of an XSS vulnerability.
- **No fallback secret** — The server refuses to start if `JWT_SECRET` is not set, preventing accidental deployment with a weak default.
- **Unified login errors** — Both "user not found" and "wrong password" return the same `Invalid credentials.` message to prevent email enumeration.
- **Login rate limiting** — Login attempts are capped at 10 per IP per 15-minute window. The current implementation is in-memory; swap in a Redis store for multi-instance deployments.
- **Password complexity** — Passwords must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit.
- **CORS with credentials** — The server sets `credentials: true` alongside an explicit allow-list origin, which is required for cross-origin cookie delivery during development.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Copy `server/.env.example` to `server/.env` and fill in your values.
3. Run `npm run install` then `npm run develop`.
4. Open a pull request with a clear description of the change.

---

## License

This project does not currently have a licence. All rights reserved by the authors.

---

**Created by [Jose Allan](https://github.com/Alanjose23) and [David Hall](https://github.com/davjhall)**
