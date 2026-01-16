# Setup Guide - PushNotify Platform

## Quick Start Guide

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. MongoDB Setup

Install MongoDB locally or use MongoDB Atlas (cloud).

**Local MongoDB:**
- Download from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Default connection: `mongodb://localhost:27017/pushnotifications`

**MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Replace in `.env` file

### 3. Backend Configuration

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pushnotifications
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VAPID_SUBJECT=mailto:your-email@example.com
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to `.env` file

### 5. Generate VAPID Keys

Run this command in backend directory:

```bash
cd backend
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public Key:', keys.publicKey); console.log('Private Key:', keys.privateKey);"
```

Add the keys to `backend/.env`:
```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### 6. Frontend Configuration

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 7. Run the Application

**Option 1: Run both together (from root)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 8. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Google OAuth Error
- Verify Client ID and Secret in `.env`
- Check redirect URI matches exactly
- Ensure Google+ API is enabled

### Port Already in Use
- Change PORT in `backend/.env`
- Kill process using port: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### CORS Errors
- Verify CLIENT_URL in `backend/.env` matches frontend URL
- Check browser console for specific error

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `CLIENT_URL` to production domain
3. Use secure MongoDB connection string
4. Generate production VAPID keys
5. Build frontend: `cd frontend && npm run build`
6. Serve frontend build with backend or separate server

## Features Checklist

✅ Gmail OAuth Login
✅ Project Management
✅ Subscriber Management
✅ Notification Creation & Sending
✅ Analytics Dashboard
✅ Service Worker for Push
✅ Royal Blue Premium UI
✅ Smooth Animations
✅ Responsive Design

## Support

For issues, check:
1. All environment variables are set
2. MongoDB is running
3. Google OAuth credentials are correct
4. Ports 3000 and 5000 are available

