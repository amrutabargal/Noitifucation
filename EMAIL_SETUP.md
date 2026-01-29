# 📧 Email Configuration for Password Reset

## Required .env Variables

Add these variables to your `backend/.env` file:

### Option 1: Gmail (Recommended for Development)

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Push Notification Platform
CLIENT_URL=http://localhost:3000
```

**Important for Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an **App Password** (not your regular password):
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Push Notification Platform"
   - Copy the 16-character password
   - Use this as `EMAIL_PASS`

### Option 2: SMTP Server (Production)

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Push Notification Platform
CLIENT_URL=https://yourdomain.com
```

### Option 3: SendGrid

```env
# Email Configuration (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Push Notification Platform
CLIENT_URL=https://yourdomain.com
```

### Option 4: Mailgun

```env
# Email Configuration (Mailgun)
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASS=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Push Notification Platform
CLIENT_URL=https://yourdomain.com
```

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` (TLS) or `465` (SSL) |
| `EMAIL_SECURE` | Use SSL/TLS | `false` for port 587, `true` for port 465 |
| `EMAIL_USER` | SMTP username | Your email or API key username |
| `EMAIL_PASS` | SMTP password | Your password or API key |
| `EMAIL_FROM` | Sender email address | `noreply@yourdomain.com` |
| `EMAIL_FROM_NAME` | Sender display name | `Push Notification Platform` |
| `CLIENT_URL` | Frontend URL for reset links | `http://localhost:3000` |

## Quick Setup (Gmail)

1. **Add to `backend/.env`:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Push Notification Platform
   CLIENT_URL=http://localhost:3000
   ```

2. **Get Gmail App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Generate password for "Mail"
   - Copy the 16-character password (remove spaces)
   - Paste as `EMAIL_PASS`

3. **Restart backend server:**
   ```bash
   cd backend
   npm start
   ```

4. **Test password reset:**
   - Go to login page
   - Click "Forgot Password"
   - Enter your email
   - Check your inbox for reset link

## Verification

When you start the backend server, you should see:
- ✅ `Email service configured and verified` (if configured correctly)
- ⚠️ `Email service not configured` (if variables are missing)

## Troubleshooting

### Email not sending?
1. Check `.env` file has all required variables
2. Verify `EMAIL_PASS` is correct (App Password for Gmail)
3. Check backend console for error messages
4. Ensure `CLIENT_URL` matches your frontend URL

### Gmail "Less secure app" error?
- Use **App Password** instead of regular password
- Enable 2-Factor Authentication first

### Port 587 blocked?
- Try port `465` with `EMAIL_SECURE=true`
- Or use port `25` (may be blocked by some ISPs)

## Security Notes

- Never commit `.env` file to git
- Use App Passwords for Gmail (not your main password)
- In production, use a dedicated email service (SendGrid, Mailgun, etc.)
- Reset tokens expire after 1 hour

