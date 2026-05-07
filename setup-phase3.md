# Phase 3 Setup Instructions

## 🚀 Real-Time System & Monetization Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Update the following variables:
- `STRIPE_SECRET_KEY`: Your Stripe test secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe test publishable key  
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `FRONTEND_URL`: `http://localhost:3000`

### 2. Install Dependencies
```bash
# Backend dependencies
npm install socket.io stripe helmet express-rate-limit zod

# Frontend dependencies  
cd frontend
npm install socket.io-client @stripe/stripe-js @heroicons/react
```

### 3. Start Services

#### Backend Server
```bash
cd d:/web2/web_phase2
npm run dev
```

#### Webhook Server (for Stripe testing)
```bash
cd d:/web2/web_phase2
node webhook.js
```

#### Frontend
```bash
cd d:/web2/web_phase2/frontend
npm run dev
```

### 4. Stripe CLI Setup (Optional - for local webhook testing)
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3001/webhook
```

### 5. Test Features

#### Real-Time Notifications
1. Login as two different users
2. Like a video from one account
3. See real-time notification on the other account

#### Stripe Tips
1. Click "Tip" button on any video
2. Complete test payment with Stripe test cards:
   - Card Number: `4242424242424242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

#### Admin Dashboard
1. Login with admin credentials:
   - Email: `admin@clipsphere.local`
   - Password: `admin123`
2. Access `/admin` for real-time statistics

### 6. Security Features
- ✅ Helmet.js security headers
- ✅ Rate limiting on all endpoints
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ Socket.io authentication

### 7. Advanced UI Features
- ✅ Glassmorphism effects on video cards
- ✅ Skeleton loaders for better UX
- ✅ Real-time notification toasts
- ✅ Smooth animations and transitions

## 🔧 Testing Checklist

### Real-Time Features
- [ ] Like notifications appear instantly
- [ ] Comment notifications work
- [ ] Tip notifications are received
- [ ] Video feed updates in real-time

### Stripe Integration
- [ ] Tip modal opens correctly
- [ ] Stripe Checkout loads
- [ ] Test payments complete successfully
- [ ] Webhook events are processed
- [ ] Earnings page shows transactions

### Security
- [ ] Rate limiting prevents abuse
- [ ] CORS policies are enforced
- [ ] Input validation works
- [ ] Security headers are present

### UI/UX
- [ ] Glassmorphism effects visible
- [ ] Skeleton loaders show during loading
- [ ] Notifications have smooth animations
- [ ] Mobile responsiveness works

## 🎯 Key Features Implemented

1. **Socket.io Real-Time Layer**
   - Personalized user rooms
   - Live like notifications
   - Real-time comment updates
   - Video upload broadcasts

2. **Stripe Monetization**
   - Creator tipping system
   - Test mode integration
   - Transaction tracking
   - Earnings dashboard

3. **Security & Validation**
   - Helmet.js protection
   - Rate limiting
   - Zod validation
   - CORS configuration

4. **Advanced UI**
   - Glassmorphism overlays
   - Skeleton loaders
   - Notification toasts
   - Enhanced animations

## 🚨 Troubleshooting

### Socket.io Issues
- Check backend console for socket connections
- Verify JWT token is being passed correctly
- Ensure CORS allows socket connections

### Stripe Issues
- Verify webhook endpoint is accessible
- Check webhook secret matches
- Use Stripe CLI for local testing

### Rate Limiting
- Adjust limits in `middleware/security.js`
- Monitor console for rate limit warnings
- Check Redis if using for rate limit storage
