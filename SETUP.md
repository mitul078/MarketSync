# MarketSync Setup Guide

## Quick Start

Follow these steps to get MarketSync running on your machine.

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)

### Step-by-Step Installation

#### 1. Install Server Dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

This will install all backend dependencies including:
- Express.js
- Mongoose
- CORS
- dotenv
- nodemon (for development)

#### 2. Configure Server Environment

Copy the example environment file:

```bash
copy env.example .env
```

On Unix/Mac:
```bash
cp env.example .env
```

Edit the `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketsync
NODE_ENV=development
```

**For MongoDB Atlas users:**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketsync
```

#### 3. Install Client Dependencies

Open a new terminal and run:

```bash
cd client
npm install
```

This will install all frontend dependencies including:
- React
- TailwindCSS
- Recharts
- Axios
- jsPDF
- date-fns
- lucide-react

#### 4. Start MongoDB

**Local MongoDB:**
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**MongoDB Atlas:**
No action needed - your database is already running in the cloud!

#### 5. Start the Server

In the server directory:

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📊 Environment: development
```

#### 6. Start the Client

In a new terminal, navigate to the client directory:

```bash
npm start
```

The React app will automatically open in your browser at http://localhost:3000

## Verify Installation

You should see:
1. **Server** running on http://localhost:5000
2. **Client** running on http://localhost:3000
3. **MongoDB** connection successful

## Troubleshooting

### MongoDB Connection Issues

**Error: `MongooseServerSelectionError`**

Solutions:
1. Make sure MongoDB is running
2. Check your `MONGODB_URI` in `.env` file
3. If using Atlas, verify your IP address is whitelisted
4. Check your username/password are correct

### Port Already in Use

**Error: `Port 5000 already in use`**

Solution:
Change the port in `server/.env`:
```
PORT=5001
```

And update the proxy in `client/package.json`:
```json
"proxy": "http://localhost:5001"
```

### CORS Errors

If you see CORS errors, make sure:
1. Server is running before client
2. Proxy is correctly set in `client/package.json`
3. CORS is enabled in `server/server.js`

### TailwindCSS Not Working

If styles look broken:
```bash
cd client
npm install -D tailwindcss postcss autoprefixer
```

Then rebuild:
```bash
npm run build
```

### Dependencies Installation Fails

Try these solutions:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use yarn instead
yarn install
```

## Development Tips

1. **Hot Reload**: Both server and client support hot reload during development
2. **API Testing**: Use Postman or Thunder Client to test API endpoints
3. **Database GUI**: Use MongoDB Compass to view/edit data
4. **Console Logs**: Check browser console and terminal for debugging info

## Production Build

To create production builds:

**Client:**
```bash
cd client
npm run build
```

The optimized build will be in `client/build/`

**Server:**
```bash
cd server
NODE_ENV=production npm start
```

## Next Steps

1. Start logging your trades!
2. Explore the dashboard and statistics
3. Export your journal as CSV or PDF
4. Check out the dark mode toggle

## Need Help?

- Check the README.md for general information
- Review API documentation in `server/routes/tradeRoutes.js`
- Open an issue on GitHub
- Check MongoDB logs for database issues

Happy Trading! 📈




