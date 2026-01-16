# 🚀 Quick Start Guide - Full Working Website

## ✅ Complete Setup Instructions

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install-all

# Or install separately:
cd backend
npm install

cd ../frontend
npm install
```

### Step 2: Setup Backend

1. Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pushnotifications
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VAPID_SUBJECT=mailto:your-email@example.com
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

2. Generate VAPID Keys:
```bash
cd backend
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public:', keys.publicKey); console.log('Private:', keys.privateKey);"
```

3. Add VAPID keys to `.env` (optional - will be auto-generated per project)

### Step 3: Setup Frontend

Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: Check Services
# Mac/Linux: mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### Step 5: Start the Application

**Option 1: Run Both Together**
```bash
npm run dev
```

**Option 2: Run Separately**

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

### Step 6: Access the Website

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Step 7: Login

1. Click "Continue with Google"
2. Authorize with your Google account
3. You'll be redirected to Dashboard

## 🎯 What You'll See

### After Login:

1. **Dashboard** (`/`)
   - Statistics cards
   - Recent projects
   - Quick actions

2. **Projects** (`/projects`)
   - List of all projects
   - Create new project button
   - Project cards with stats

3. **Project Detail** (`/projects/:id`)
   - Overview tab
   - Subscribers tab
   - Notifications tab
   - Integration tab (with code)

4. **Notifications** (`/notifications`)
   - List of all notifications
   - Create notification button
   - Send/manage notifications

5. **Analytics** (`/analytics`)
   - Charts and graphs
   - Performance metrics
   - Export to CSV

6. **Settings** (`/settings`)
   - User profile
   - Account information

## 🎨 Features Working

✅ **Royal Blue Theme** - Premium UI
✅ **Smooth Animations** - Framer Motion
✅ **Responsive Design** - Mobile & Desktop
✅ **Full Functionality** - All features working
✅ **Proper Layout** - Sidebar + Main Content
✅ **No Black Screens** - All backgrounds set

## 🔧 Troubleshooting

### If you see black screen:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors

### If backend doesn't start:
1. Check MongoDB is running
2. Verify `.env` file exists
3. Check port 5000 is available

### If frontend doesn't start:
1. Check port 3000 is available
2. Verify `frontend/.env` exists
3. Run `npm install` in frontend folder

## 📱 Website Features

- ✅ Login with Gmail
- ✅ Create Projects
- ✅ Manage Subscribers
- ✅ Send Notifications
- ✅ View Analytics
- ✅ Export Data (CSV)
- ✅ Beautiful UI
- ✅ Smooth Animations

## 🎉 You're Ready!

The website is now fully functional and ready to use. All pages should display properly with:
- Proper layout
- Full-width content
- Working sidebar
- All features functional

**Enjoy your premium push notification platform!** 🚀

