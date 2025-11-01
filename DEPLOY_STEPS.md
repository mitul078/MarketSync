# 🚀 Step-by-Step Deployment Guide

## Method 1: Railway (Backend) + Vercel (Frontend) - RECOMMENDED

### Prerequisites
- GitHub account
- MongoDB Atlas account (free tier is fine)

---

### Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new **FREE** cluster (choose closest region)
4. Wait for cluster to finish creating (~5 minutes)
5. Click **"Connect"** → **"Connect your application"**
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
7. Click **"Database Access"** → Add new database user
   - Username: `marketsync`
   - Password: Generate secure password (save it!)
8. Click **"Network Access"** → Add IP Address
   - Click **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Railway's IPs later

---

### Step 2: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your **MarketSync** repository
5. Railway will auto-detect Node.js
6. Click on the service → Go to **"Settings"**
7. Set **Root Directory** to: `server`
8. Go to **"Variables"** tab → Add these environment variables:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
NODE_ENV=production
JWT_SECRET=generate_a_random_32_char_string
CLIENT_URL=https://your-frontend-url.vercel.app
```

**To generate JWT_SECRET:**
- Go to https://randomkeygen.com/
- Copy a 64-character key from "CodeIgniter Encryption Keys"
- Or use: `openssl rand -hex 32` in terminal

9. Click **"Deploy"** button
10. Wait for deployment to finish (~2-3 minutes)
11. Click **"Settings"** → **"Generate Domain"**
12. Copy your Railway URL (e.g., `https://marketsync-api.railway.app`)

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com and sign up with GitHub
2. Click **"New Project"** → Import your GitHub repository
3. Select your **MarketSync** repository
4. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `build`
5. Click **"Environment Variables"** → Add:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```
   (Replace with your Railway URL from Step 2)
6. Click **"Deploy"**
7. Wait for deployment (~2 minutes)
8. Copy your Vercel URL (e.g., `https://marketsync.vercel.app`)

---

### Step 4: Update Backend CORS (2 minutes)

1. Go back to Railway → Your backend service
2. Go to **"Variables"**
3. Update `CLIENT_URL` to your Vercel frontend URL
4. Railway will automatically redeploy

---

### Step 5: Test Your Deployment (5 minutes)

1. Visit your Vercel frontend URL
2. **Sign up** with a new account
3. **Login** with your credentials
4. **Add funds** to your wallet
5. **Create a trade** with:
   - Select **Stock** or **Option**
   - Enter Entry/Exit prices
   - Verify charges are calculated correctly
6. Check **Trade History** → Verify charges column shows

---

## Method 2: Deploy Everything on Railway

### Frontend on Railway:

1. In Railway, add another service from same repo
2. Set **Root Directory** to: `client`
3. Set **Start Command:** `npx serve -s build`
4. Add build command in Railway settings:
   ```
   cd client && npm install && npm run build
   ```
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-railway-url.railway.app
   ```
6. Generate domain for frontend service
7. Update backend `CLIENT_URL` with frontend Railway URL

---

## Environment Variables Cheat Sheet

### Backend (.env or Railway Variables)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marketsync
NODE_ENV=production
JWT_SECRET=your_64_character_random_string_here
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel Environment Variables)
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## Common Issues & Solutions

### ❌ Backend can't connect to MongoDB
**Solution:**
- Check MongoDB Atlas Network Access → Add 0.0.0.0/0
- Verify MongoDB URI has correct username/password
- Ensure database user has read/write permissions

### ❌ Frontend can't reach backend
**Solution:**
- Verify `REACT_APP_API_URL` matches backend URL
- Check backend CORS settings
- Ensure `CLIENT_URL` in backend matches frontend URL
- Both should use HTTPS in production

### ❌ Cookies not working
**Solution:**
- Both URLs must use HTTPS
- Check CORS `credentials: true` in backend
- Verify cookie `sameSite` settings match production

### ❌ Build fails
**Solution:**
- Check Node.js version (need 18+)
- Clear `node_modules` and reinstall
- Check build logs for specific errors

---

## Production Checklist ✅

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] JWT_SECRET is strong random string
- [ ] CORS configured for production domain
- [ ] Both services use HTTPS
- [ ] Tested signup/login
- [ ] Tested adding funds
- [ ] Tested creating trade
- [ ] Tested charges calculation (Stock vs Option)
- [ ] Tested trade history with charges column

---

## Quick Links

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Railway:** https://railway.app
- **Vercel:** https://vercel.com
- **Random Key Generator:** https://randomkeygen.com/

---

**Congratulations! 🎉 Your MarketSync app is now live!**

Share your deployed URL with others or use it for your personal trading journal.




