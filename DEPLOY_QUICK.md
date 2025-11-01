# 🚀 Quick Deployment Guide - MarketSync

## Fastest Way: Railway (Recommended for Beginners)

### Step 1: Prepare Repository
```bash
# Make sure your code is on GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your MarketSync repository
4. Add service → Change root directory to `server`
5. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   NODE_ENV=production
   JWT_SECRET=generate_with_openssl_rand_hex_32
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
6. Click "Deploy"
7. Copy the deployed URL (e.g., `https://marketsync-api.railway.app`)

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" → Import your GitHub repo
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `build`
   - **Environment Variable:**
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     ```
4. Click "Deploy"
5. Copy the deployed URL

### Step 4: Update CORS

1. Go back to Railway backend settings
2. Update `CLIENT_URL` environment variable with your Vercel frontend URL
3. Redeploy backend

### Step 5: Get MongoDB Atlas URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster → Wait for it to finish
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Add to Railway backend environment variables as `MONGODB_URI`

### Step 6: Generate JWT Secret

```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows (PowerShell)
-UseBasicParsing | ForEach-Object { [Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 })) }
```

Or use an online generator: https://randomkeygen.com/

---

## 🎯 That's It!

Your app should now be live at your Vercel URL!

**Test it:**
1. Visit your frontend URL
2. Sign up → Create account
3. Add funds → Test wallet
4. Create trade → Test charges calculation
5. Switch Stock/Option → Verify different charges

---

## 🔧 If Something Breaks

### Backend not connecting?
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 or Railway IPs)
- Verify MongoDB URI is correct
- Check Railway logs

### Frontend can't reach backend?
- Verify `REACT_APP_API_URL` matches Railway backend URL
- Check CORS settings in backend
- Ensure `CLIENT_URL` in backend matches frontend URL

### Cookies not working?
- Both URLs should use HTTPS
- Check CORS `credentials: true` in backend
- Verify cookie settings match deployment environment

---

## 📞 Quick Commands

**Build frontend locally:**
```bash
cd client && npm run build
```

**Test backend locally:**
```bash
cd server && npm start
```

**View Railway logs:**
```bash
railway logs
```

**View Vercel logs:**
```bash
vercel logs
```

---

**Need MongoDB Atlas?** https://www.mongodb.com/cloud/atlas/register


