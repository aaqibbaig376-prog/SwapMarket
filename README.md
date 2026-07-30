# SwapMarket 👗♻️

A sustainable clothing exchange marketplace where users can trade fashion items without money. Built with React, Express, and SQLite.

## Features

- 🔍 **Browse & Filter** items by category, condition, location, and keyword
- 🔄 **Swap Requests** — propose item trades with other users
- 💬 **Real-time Chat** for each accepted swap
- ❤️ **Wishlist** — save favorite items
- 🔔 **Notifications** for swap requests and messages
- 🌙 **Dark Mode** toggle
- 🛡️ **Admin Panel** for moderation

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Express.js, Node.js |
| Database | SQLite (via Sequelize ORM) |
| Auth | JWT (JSON Web Tokens) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/aaqibbaig376-prog/SwapMarket.git
cd SwapMarket

# Install all dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Seed the database with sample data
cd server && node seed.js && cd ..

# Run the app (frontend + backend concurrently)
npm run dev
```

### Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| User | `jane@example.com` | `password123` |
| User | `john@example.com` | `password123` |
| Admin | `admin@swapstyle.com` | `admin123` |

## Project Structure

```
SwapMarket/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable components (Navbar)
│       ├── context/      # Auth context
│       ├── pages/        # App pages
│       └── api/          # Axios API client
└── server/               # Express backend
    ├── models/           # Sequelize models
    ├── routes/           # API routes
    └── middlewares/      # Auth middleware
```

## License
MIT
