# MarketSync Deployment Guide

This guide will help you deploy MarketSync to production. The application consists of:
- **Frontend**: React app (in `client/` folder)
- **Backend**: Node.js/Express API (in `server/` folder)
- **Database**: MongoDB

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env` file in the `server/` folder with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
JWT_SECRET=your_secure_random_jwt_secret_key_here
CLIENT_URL=https://your-frontend-domain.com
```

**Important Security Notes:**
- Use a strong, random JWT_SECRET (generate with: `openssl rand -hex 32`)
- Never commit `.env` files to Git
- Use MongoDB Atlas (cloud) or your own MongoDB server for production

### 2. MongoDB Setup

**Option A: MongoDB Atlas (Recommended for beginners)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Create a database user
5. Whitelist IP addresses (0.0.0.0/0 for all, or your server IP)
6. Get connection string and add to `MONGODB_URI`

**Option B: Self-hosted MongoDB**
- Install MongoDB on your server
- Use connection string: `mongodb://localhost:27017/marketsync`

---

## 🚀 Deployment Options

### Option 1: Deploy Both on Railway (Easiest - Recommended)

[Railway](https://railway.app) can deploy both frontend and backend easily.

**Steps:**
1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. **Deploy Backend:**
   - Add new service → Deploy from GitHub repo
   - Select `server/` as root directory
   - Add environment variables
   - Deploy
4. **Deploy Frontend:**
   - Add new service → Deploy from GitHub repo
   - Select `client/` as root directory
   - Set build command: `npm install && npm run build`
   - Set start command: `npx serve -s build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

**Pros:** Free tier, easy setup, automatic deployments
**Cons:** Limited free tier resources

---

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `client`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com`
5. Deploy

**Backend on Railway/Render:**
- Follow Option 1 backend steps above

**Pros:** Vercel excellent for React, free tier generous
**Cons:** Two platforms to manage

---

### Option 3: Deploy on VPS (DigitalOcean, AWS EC2, etc.)

**Prerequisites:**
- VPS with Ubuntu/Debian
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

**Backend Setup:**
```bash
# On your server
cd /var/www
git clone your-repo-url
cd MarketSync/server
npm install
cp .env.example .env
# Edit .env with your values
npm install -g pm2
pm2 start server.js --name marketsync-api
pm2 save
pm2 startup
```

**Frontend Setup:**
```bash
# Build React app locally or on server
cd ../client
npm install
npm run build

# Install nginx
sudo apt update
sudo apt install nginx

# Configure nginx
sudo nano /etc/nginx/sites-available/marketsync
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/MarketSync/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/marketsync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📦 Build Commands

### Build Frontend (Production)
```bash
cd client
npm install
npm run build
# Output will be in client/build/
```

### Run Backend (Production)
```bash
cd server
npm install
npm start
# Or with PM2: pm2 start server.js --name marketsync-api
```

---

## 🔒 Production Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (SSL certificate)
- [ ] Update CORS to only allow your frontend domain
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable MongoDB authentication
- [ ] Set up regular database backups
- [ ] Use strong MongoDB passwords
- [ ] Limit MongoDB IP whitelist to your server IPs

---

## 🌐 Environment Variables Reference

### Server (.env)
```env
PORT=5000                          # Server port
MONGODB_URI=mongodb://...         # MongoDB connection string
NODE_ENV=production               # Environment
JWT_SECRET=your_secret_key        # JWT signing secret (32+ chars)
CLIENT_URL=https://your-app.com  # Frontend URL for CORS
```

### Client (Build-time env vars)
```env
REACT_APP_API_URL=https://api.your-app.com  # Backend API URL
```

**Note:** React env vars must start with `REACT_APP_`

---

## 🔄 Update CORS for Production

In `server/server.js`, update:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://your-production-domain.com',
  credentials: true,
  // ... rest of config
};
```

---

## 📱 Testing Production Deployment

1. **Test Authentication:**
   - Sign up → Should create user
   - Login → Should set cookie
   - Protected routes → Should work

2. **Test Trading:**
   - Add funds → Should update balance
   - Create trade → Should calculate charges correctly
   - Check trade history → Should display charges column

3. **Test Charges Calculation:**
   - Switch between Stock/Option → Should show different charges
   - Verify formulas match Zerodha rates

---

## 🆘 Troubleshooting

### Issue: Cookies not working
**Solution:** Ensure CORS `credentials: true` and cookie `sameSite` settings match your setup

### Issue: API calls failing
**Solution:** Check `REACT_APP_API_URL` in frontend build and CORS origin in backend

### Issue: Database connection failed
**Solution:** Verify MongoDB URI, check IP whitelist, verify credentials

### Issue: Build fails
**Solution:** Check Node.js version (need 18+), ensure all dependencies installed

---

## 🎯 Quick Deploy Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created and connected
- [ ] Frontend built successfully
- [ ] Backend tested locally
- [ ] CORS configured for production domain
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain DNS configured
- [ ] Both services deployed and running
- [ ] Tested end-to-end in production

---

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.

