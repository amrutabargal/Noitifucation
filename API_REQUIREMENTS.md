# Complete API Requirements for ZestPush-like Platform

Based on [ZestPush.com](https://zestpush.com/) features, here's the complete list of APIs needed:

## 📋 API Categories

### 1. ✅ AUTHENTICATION APIs (Already Implemented)
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - Email/password login
- ✅ `GET /api/auth/google` - Google OAuth login
- ✅ `GET /api/auth/google/callback` - Google OAuth callback
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/auth/logout` - Logout
- ✅ `POST /api/auth/forgot-password` - Password reset request

---

### 2. ✅ PROJECT/WEBSITE MANAGEMENT APIs (Already Implemented)
- ✅ `GET /api/projects` - Get all projects/websites
- ✅ `GET /api/projects/:id` - Get single project
- ✅ `POST /api/projects` - Create new project/website
- ✅ `PUT /api/projects/:id` - Update project
- ✅ `DELETE /api/projects/:id` - Delete project

**Missing Features:**
- ❌ `GET /api/projects/:id/integration-script` - Get one-click integration script
- ❌ `GET /api/projects/:id/settings` - Get project settings (prompt design, etc.)
- ❌ `PUT /api/projects/:id/settings` - Update project settings

---

### 3. ✅ SUBSCRIBER MANAGEMENT APIs (Partially Implemented)
- ✅ `GET /api/subscribers/project/:projectId` - Get all subscribers
- ✅ `POST /api/subscribers/subscribe` - Subscribe endpoint (public)
- ✅ `POST /api/subscribers/unsubscribe` - Unsubscribe endpoint (public)
- ✅ `GET /api/subscribers/stats/:projectId` - Get subscriber stats
- ✅ `GET /api/subscribers/export/:projectId` - Export subscribers CSV
- ✅ `POST /api/subscribers/import/:projectId` - Import subscribers

**Missing Features:**
- ❌ `GET /api/subscribers/project/:projectId/filter` - Advanced filtering/segmentation
- ❌ `DELETE /api/subscribers/:id` - Delete subscriber
- ❌ `PUT /api/subscribers/:id` - Update subscriber (tags, attributes)

---

### 4. ⚠️ NOTIFICATION/CAMPAIGN APIs (Partially Implemented)
**Existing:**
- ✅ `GET /api/notifications/project/:projectId` - Get all notifications
- ✅ `GET /api/notifications/:id` - Get single notification
- ✅ `POST /api/notifications` - Create notification
- ✅ `PUT /api/notifications/:id` - Update notification
- ✅ `DELETE /api/notifications/:id` - Delete notification
- ✅ `POST /api/notifications/:id/send` - Send notification

**Missing Critical APIs:**
- ❌ `POST /api/notifications/load-from-url` - Load push data from article URL (scrape title, image, etc.)
- ❌ `POST /api/notifications/:id/renew` - Renew old push (resend with updated data)
- ❌ `POST /api/notifications/:id/clone` - Clone/copy notification/campaign
- ❌ `GET /api/notifications/project/:projectId/campaigns` - Get campaigns (grouped notifications)
- ❌ `POST /api/notifications/advanced` - Advanced push with buttons, badge, logo, UTM params
- ❌ `GET /api/notifications/project/:projectId/scheduled` - Get scheduled notifications
- ❌ `POST /api/notifications/:id/cancel` - Cancel scheduled notification

**Missing Fields in Notification Model:**
- ❌ `badge` - Badge image URL
- ❌ `logo` - Logo image URL
- ❌ `buttons` - Array of action buttons
- ❌ `utm` - UTM parameters object
- ❌ `campaignId` - Campaign grouping
- ❌ `dndMode` - DND/Magic mode settings

---

### 5. ⚠️ ANALYTICS APIs (Partially Implemented)
**Existing:**
- ✅ `GET /api/analytics/project/:projectId` - Basic analytics
- ✅ `GET /api/analytics/export/:projectId` - Export analytics CSV

**Missing Critical APIs:**
- ❌ `GET /api/analytics/project/:projectId/30-day-overview` - 30-day user overview graph
- ❌ `GET /api/analytics/project/:projectId/30-day-campaigns` - 30-day campaign overview
- ❌ `GET /api/analytics/project/:projectId/demographics` - User demographics (State, Country, OS, Browser, Website)
- ❌ `GET /api/analytics/project/:projectId/campaign/:campaignId` - Campaign-specific analytics
- ❌ `GET /api/analytics/project/:projectId/push-stats` - Detailed push statistics
- ❌ `GET /api/analytics/project/:projectId/realtime` - Real-time analytics data

---

### 6. ⚠️ SEGMENTATION APIs (Missing)
- ❌ `GET /api/segments/project/:projectId` - Get all segments
- ❌ `POST /api/segments` - Create segment (with 9+ properties: user, state, country, device, OS, website, browser, from date, to date, between date)
- ❌ `PUT /api/segments/:id` - Update segment
- ❌ `DELETE /api/segments/:id` - Delete segment
- ❌ `GET /api/segments/:id/subscribers` - Get subscribers in segment
- ❌ `GET /api/segments/project/:projectId/default` - Get 7 default segments

**Segment Properties Needed:**
- User attributes
- State
- Country
- Device type
- Operating System
- Website/source
- Browser
- Date range (from, to, between)
- Tags
- Custom attributes

---

### 7. ⚠️ AUTOMATION/RSS APIs (Partially Implemented)
**Existing:**
- ✅ `GET /api/automations/project/:projectId` - Get automations
- ✅ `GET /api/automations/:id` - Get single automation
- ✅ `POST /api/automations` - Create automation
- ✅ `PUT /api/automations/:id` - Update automation
- ✅ `DELETE /api/automations/:id` - Delete automation

**Missing Critical APIs:**
- ❌ `POST /api/automations/rss` - Create RSS-to-Push automation
- ❌ `GET /api/automations/rss/project/:projectId` - Get RSS automations
- ❌ `POST /api/automations/rss/:id/test` - Test RSS feed
- ❌ `PUT /api/automations/rss/:id/enable` - Enable/disable RSS automation
- ❌ `POST /api/automations/rss/:id/trigger` - Manually trigger RSS check

**RSS Automation Features:**
- RSS feed URL
- Auto-detect new URLs
- Custom notification template
- Filter conditions
- Schedule check frequency

---

### 8. ❌ EXTERNAL REST APIs (Missing - Critical for ZestPush)
**Public APIs (with API Key authentication):**
- ❌ `POST /api/v1/ext/rest-notification` - Send push via REST API (basic & advanced)
  - Headers: `userid`, `siteid`, `key`
  - Body: `title`, `body`, `link`, `img`, `logo`, `badge`, `action[]`, `schedule`, `tag`, `segment`, `utm`
- ❌ `POST /api/v1/ext/rest-analytics` - Get 30-day user overview via API
  - Headers: `userid`, `siteid`, `key`
- ❌ `GET /api/v1/ext/rest-push/:pushId` - Get push details (coming soon per ZestPush)

**API Key Management:**
- ❌ `GET /api/projects/:id/api-keys` - Get API keys
- ❌ `POST /api/projects/:id/api-keys` - Generate new API key
- ❌ `DELETE /api/projects/:id/api-keys/:keyId` - Revoke API key

---

### 9. ❌ CAMPAIGN MANAGEMENT APIs (Missing)
- ❌ `GET /api/campaigns/project/:projectId` - Get all campaigns
- ❌ `POST /api/campaigns` - Create campaign
- ❌ `GET /api/campaigns/:id` - Get campaign details
- ❌ `POST /api/campaigns/:id/clone` - Clone campaign
- ❌ `GET /api/campaigns/:id/report` - Get campaign report
- ❌ `PUT /api/campaigns/:id` - Update campaign
- ❌ `DELETE /api/campaigns/:id` - Delete campaign

---

### 10. ❌ DND MODE (Magic Mode) APIs (Missing)
- ❌ `GET /api/projects/:id/dnd-settings` - Get DND mode settings
- ❌ `PUT /api/projects/:id/dnd-settings` - Update DND mode (limit notification count per user)
- ❌ `POST /api/notifications/:id/apply-dnd` - Apply DND mode to notification

---

### 11. ❌ IMPORT/EXPORT APIs (Partially Implemented)
**Existing:**
- ✅ `GET /api/subscribers/export/:projectId` - Export subscribers
- ✅ `POST /api/subscribers/import/:projectId` - Import subscribers

**Missing:**
- ❌ `POST /api/notifications/import` - Import notifications from other providers
- ❌ `GET /api/projects/:id/export-all` - Export all project data
- ❌ `POST /api/projects/:id/import-all` - Import all project data

---

### 12. ❌ WORDPRESS PLUGIN APIs (Missing)
- ❌ `POST /api/wordpress/publish` - Webhook for WordPress post publish
- ❌ `GET /api/wordpress/project/:projectId/30-day-chart` - 30-day user chart for WordPress
- ❌ `GET /api/wordpress/project/:projectId/settings` - WordPress plugin settings

---

### 13. ❌ CUSTOM PROMPT/SETTINGS APIs (Missing)
- ❌ `GET /api/projects/:id/prompt-settings` - Get custom prompt settings (5 designs, 14 properties)
- ❌ `PUT /api/projects/:id/prompt-settings` - Update prompt design
- ❌ `GET /api/prompts/templates` - Get available prompt templates

**Prompt Properties:**
- Button background color
- Button text
- Main text
- Sub text
- Body background opacity
- Cancel button visibility
- Delay
- And 7 more properties...

---

### 14. ❌ IN-APP MESSAGING APIs (Missing)
- ❌ `GET /api/projects/:id/in-app-messages` - Get in-app messages (bell icon)
- ❌ `POST /api/projects/:id/in-app-messages` - Create in-app message
- ❌ `PUT /api/in-app-messages/:id` - Update in-app message
- ❌ `DELETE /api/in-app-messages/:id` - Delete in-app message
- ❌ `GET /api/in-app-messages/project/:projectId/latest` - Get latest messages for bell icon

---

### 15. ✅ EVENTS/TRACKING APIs (Already Implemented)
- ✅ `POST /api/events/track` - Track custom events (with API key)
- ✅ `GET /api/events/project/:projectId` - Get events for project

---

### 16. ❌ SCHEDULING APIs (Partially Implemented)
**Existing:**
- ✅ Notification model supports `scheduledFor` and `recurring`

**Missing:**
- ❌ `GET /api/notifications/project/:projectId/scheduled` - Get all scheduled notifications
- ❌ `POST /api/notifications/:id/reschedule` - Reschedule notification
- ❌ `POST /api/notifications/:id/cancel-schedule` - Cancel scheduled notification

---

## 📊 Summary

### ✅ Already Implemented: 25 APIs
- Authentication (7)
- Projects (5)
- Subscribers (6)
- Notifications (6)
- Analytics (2)
- Automations (5)
- Events (2)

### ❌ Missing: ~45 APIs

**Priority 1 (Critical for MVP):**
1. External REST API for sending pushes
2. Advanced notification with buttons, badge, logo, UTM
3. Load push data from URL
4. Renew old push
5. Clone notification/campaign
6. 30-day analytics overview
7. Demographics analytics
8. Segmentation APIs
9. RSS-to-Push automation
10. DND Mode settings

**Priority 2 (Important Features):**
1. Campaign management
2. Import/export notifications
3. WordPress plugin APIs
4. Custom prompt settings
5. In-app messaging
6. Advanced scheduling

**Priority 3 (Nice to Have):**
1. AMP integration APIs
2. Advanced filtering
3. Real-time analytics

---

## 🎯 Next Steps

1. **Review this list** and prioritize which APIs to implement first
2. **Start with Priority 1** APIs for MVP
3. **Enhance existing models** to support missing fields (buttons, badge, logo, UTM, etc.)
4. **Create new models** if needed (Campaign, Segment, RSS Automation, etc.)

Would you like me to start implementing these APIs? I can begin with the Priority 1 list.

