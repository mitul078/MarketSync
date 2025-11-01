# 🚀 Quick Start Guide

Get MarketSync running in 5 minutes!

## ⚡ Fast Setup

### Step 1: Install Dependencies

Open two terminal windows:

**Terminal 1 - Server:**
```bash
cd server
npm install
```

**Terminal 2 - Client:**
```bash
cd client
npm install
```

### Step 2: Configure Database

Create `server/.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketsync
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Don't have MongoDB installed?**
- Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- Replace `MONGODB_URI` with your Atlas connection string

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows (if installed as service)
net start MongoDB

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**Or skip this if using MongoDB Atlas!**

### Step 4: Start Servers

**Terminal 1 - Server:**
```bash
cd server
npm start
```

Wait for: `✅ MongoDB connected successfully`

**Terminal 2 - Client:**
```bash
cd client
npm start
```

Browser opens automatically at http://localhost:3000

## 🎉 You're Ready!

The app should now be running. 

**First Time Users:**
1. You'll see a login page
2. Click "Sign up" to create an account
3. Enter your name, username, email, and password
4. Start logging your trades!

## 🔧 Troubleshooting

### MongoDB Connection Failed

**Local MongoDB not running:**
- Start MongoDB service
- Or use MongoDB Atlas (cloud)

**Wrong connection string:**
- Check your `.env` file
- Verify MongoDB URI is correct

### Port Already in Use

**Port 5000 in use?**
- Change `PORT` in `server/.env` to 5001
- Update `proxy` in `client/package.json` to match

**Port 3000 in use?**
- React will ask to use a different port
- Say 'yes' or manually specify: `PORT=3001 npm start`

### Dependencies Installation Failed

```bash
# Clear cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles Not Loading

```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npm run build
```

## 📚 Next Steps

1. Log your first trade
2. Explore the dashboard
3. Check out the statistics
4. Try dark mode toggle
5. Export your data

## 💡 Tips

- **Development mode**: Use `npm run dev` for auto-reload
- **Test API**: Visit http://localhost:5000
- **Database GUI**: Install MongoDB Compass
- **Hot reload**: Both servers auto-reload on file changes

## 🆘 Still Having Issues?

Check the full documentation:
- `README.md` - Complete documentation
- `SETUP.md` - Detailed setup guide
- `PROJECT_SUMMARY.md` - Feature overview

Or open an issue on GitHub!

---

Happy Trading! 📈

