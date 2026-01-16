# Troubleshooting - Black Screen Issue

## Issue: Black/Blank Screen

If you're seeing a black or blank screen, follow these steps:

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors in Console tab.

### 2. Verify Dependencies
Make sure all dependencies are installed:

```bash
cd frontend
npm install
```

### 3. Clear Browser Cache
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Clear cache and cookies
- Refresh page (Ctrl+F5 or Cmd+Shift+R)

### 4. Check Tailwind CSS
Verify Tailwind is building correctly:

```bash
cd frontend
npm run build
```

### 5. Common Fixes

#### Fix 1: Background Color Issue
The CSS has been updated to ensure proper background:
- Background color: `#f9fafb` (light gray)
- Text color: `#111827` (dark gray)

#### Fix 2: Root Element
Make sure `index.html` has:
```html
<div id="root"></div>
```

#### Fix 3: Import CSS
Make sure `index.css` is imported in `index.js`:
```javascript
import './index.css';
```

### 6. Check Network Requests
Open DevTools → Network tab and check:
- All requests are loading successfully
- No CORS errors
- API is accessible

### 7. Environment Variables
Check `.env` file exists in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 8. Restart Development Server
```bash
cd frontend
npm start
```

### 9. Verify Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 10. Check React Version
```bash
npm list react
```
Should be React 18.x

## Quick Fixes Applied

The following fixes have been applied to prevent black screens:

1. ✅ Added explicit background colors in CSS
2. ✅ Added `App.css` with body/html styles
3. ✅ Fixed AuthContext to work outside Router
4. ✅ Added loading spinner styles
5. ✅ Ensured root element has proper styles

## Still Not Working?

1. Check if backend is running:
```bash
cd backend
npm run dev
```

2. Check if MongoDB is running

3. Verify all environment variables are set

4. Check browser console for specific errors

5. Try a different browser (Chrome, Firefox, Edge)

## Support

If issue persists, check:
- Browser console errors
- Network tab for failed requests
- Terminal for server errors

