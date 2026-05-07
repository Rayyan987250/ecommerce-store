# 🚀 Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB running (local or Atlas)

## Setup in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Configure MongoDB
Edit `.env` file and update your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

### 3️⃣ Start Server
```bash
npm run dev
```

✅ Server running at: `http://localhost:5000`

---

## Test It Works

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-04-24T..."
}
```

### Create First User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

You'll get back a token - save it!

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |

---

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check your connection string in `.env`
- For Atlas: whitelist your IP address

### Port Already in Use
Change the port in `.env`:
```env
PORT=5001
```

### TypeScript Errors
Rebuild the project:
```bash
npm run build
```

---

## What's Next?

1. Create an admin user
2. Add some products via API
3. Connect the frontend
4. Start building features!

See `README.md` for full documentation.
