# 🔧 Google OAuth Setup Guide

## ❌ Error: "OAuth client was not found" / "invalid_client"

This error means Google OAuth credentials are not properly configured. Follow these steps:

## 📝 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `PushNotify` (or any name)
4. Click **"Create"**

### Step 2: Enable Google+ API

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure **OAuth consent screen** first:
   - User Type: **External** (or Internal if you have Google Workspace)
   - App name: **PushNotify**
   - User support email: **Your email**
   - Developer contact: **Your email**
   - Click **"Save and Continue"**
   - Scopes: Click **"Save and Continue"** (default is fine)
   - Test users: Add your email, click **"Save and Continue"**
   - Click **"Back to Dashboard"**

4. Now create OAuth Client ID:
   - Application type: **Web application**
   - Name: **PushNotify Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:5000`
     - `http://localhost:3000` (if needed)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Click **"Create"**

5. **Copy the credentials:**
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxx`)

### Step 4: Add to Backend .env

1. Open `backend/.env` file
2. Add these lines:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

### Step 5: Restart Backend Server

```bash
cd backend
# Stop the server (Ctrl+C)
npm run dev
```

### Step 6: Test Google Login

1. Go to http://localhost:3000/login
2. Click **"Continue with Google"**
3. Select your Google account
4. Authorize the app
5. You should be redirected to dashboard

## ✅ Verification Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API or People API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URI added: `http://localhost:5000/api/auth/google/callback`
- [ ] Client ID and Secret copied
- [ ] Added to `backend/.env` file
- [ ] Backend server restarted
- [ ] Google login tested

## 🚨 Common Issues

### Issue 1: "redirect_uri_mismatch"
**Solution:** Make sure redirect URI in Google Console exactly matches:
```
http://localhost:5000/api/auth/google/callback
```

### Issue 2: "invalid_client"
**Solution:** 
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Make sure no extra spaces or quotes
- Restart backend server

### Issue 3: "access_denied"
**Solution:**
- Add your email to "Test users" in OAuth consent screen
- Or publish the app (for production)

### Issue 4: Still getting errors
**Solution:**
- Check backend console for detailed error messages
- Verify `.env` file is in `backend/` folder
- Make sure backend server is running on port 5000
- Check Google Cloud Console → Credentials → OAuth 2.0 Client IDs

## 🔒 Production Setup

For production, update:
1. **Authorized redirect URIs** in Google Console:
   - `https://yourdomain.com/api/auth/google/callback`

2. **Backend .env:**
```env
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CLIENT_URL=https://yourdomain.com
```

## 📞 Need Help?

If you still get errors:
1. Check backend console logs
2. Verify all steps above
3. Make sure `.env` file is correct
4. Restart backend server

## ✅ Alternative: Use Email Login

If you don't want to set up Google OAuth right now, you can use **Email Login**:
1. Click **"Email Login"** tab
2. Click **"Register"** to create account
3. Or **"Login"** if you already have account

**Email login works without any Google OAuth setup!**

---

**Note:** Google OAuth is optional. Email/Password authentication works independently.

