# PushNotify - Premium Web Push Notification Platform

A feature-rich, easy-to-use web push notification platform built with React.js and Node.js, featuring a royal blue premium UI design with smooth animations.

## Features

- 🔐 **Gmail OAuth Authentication** - Secure login with Google
- 📊 **Premium Dashboard** - Beautiful analytics and insights
- 🔔 **Push Notifications** - Full web push notification support
- 📈 **Analytics & Reporting** - Detailed campaign performance metrics
- 🎯 **Advanced Targeting** - Browser, OS, country-based targeting
- 📱 **Multi-Browser Support** - Chrome, Firefox, Edge, Safari
- 🎨 **Royal Blue Theme** - Premium UI with smooth animations
- 📦 **Project Management** - Create and manage multiple projects
- 👥 **Subscriber Management** - Track and manage subscribers
- ⚡ **Real-time Updates** - Live notification delivery tracking

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Framer Motion (Animations)
- React Router
- Axios
- Recharts (Analytics Charts)
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Google OAuth)
- Web Push (VAPID)
- JWT Authentication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials

### Setup

1. **Clone the repository**
```bash
cd notification
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Backend Setup**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pushnotifications
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VAPID_SUBJECT=mailto:your-email@example.com
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. **Frontend Setup**
```bash
cd frontend
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Generate VAPID Keys** (for backend)
```bash
cd backend
node -e "console.log(require('web-push').generateVAPIDKeys())"
```

Add the generated keys to your `.env` file.

6. **Run the application**

From root directory:
```bash
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env` file

## Project Structure

```
notification/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/
│       └── service-worker.js
└── package.json
```

## Usage

1. **Login**: Use Gmail to login
2. **Create Project**: Add your website/project
3. **Get Integration Code**: Copy VAPID keys and API key from project settings
4. **Add to Website**: Integrate the SDK code into your website
5. **Send Notifications**: Create and send push notifications from dashboard
6. **View Analytics**: Track performance and subscriber growth

## API Endpoints

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Subscribers
- `POST /api/subscribers/subscribe` - Subscribe to push
- `POST /api/subscribers/unsubscribe` - Unsubscribe
- `GET /api/subscribers/project/:id` - Get project subscribers
- `GET /api/subscribers/stats/:id` - Get subscriber stats

### Notifications
- `GET /api/notifications/project/:id` - Get project notifications
- `POST /api/notifications` - Create notification
- `POST /api/notifications/:id/send` - Send notification
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/project/:id` - Get project analytics

## Features in Detail

### Dashboard
- Overview statistics
- Recent projects
- Quick actions
- Animated cards

### Projects
- Create/manage projects
- Integration code generator
- Subscriber management
- Notification history

### Notifications
- Create instant/scheduled notifications
- Rich media support (icon, image)
- Advanced targeting
- Campaign management

### Analytics
- Delivery rates
- Click-through rates
- Subscriber growth charts
- Campaign performance

## Browser Support

- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari (macOS & iOS)

## Security

- JWT token authentication
- HTTPS required for push notifications
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS protection

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

