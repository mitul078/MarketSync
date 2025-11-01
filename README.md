# MarketSync - Personal Trading Journal

A full-stack web application for traders to record, view, and analyze their trades. Built with React, TailwindCSS, Express.js, and MongoDB.

## 🎯 Features

### Authentication & Security
- 🔐 **User Authentication**: Secure signup and login with JWT tokens
- 👤 **User Management**: Store user profiles with email, username, and name
- 🛡️ **Protected Routes**: All trades are user-specific and secured
- 🔒 **Password Security**: Bcrypt password hashing for safe storage

### Core Functionality
- ✍️ **Trade Entry Form**: Log detailed trade information including entry/exit prices, stop loss, target, and learning notes
- 📊 **Dashboard**: View all trades in a beautiful, filterable table with statistics
- 📈 **Performance Analytics**: Interactive charts showing cumulative P/L and trade-by-trade performance
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📤 **Export Data**: Export your journal as CSV or PDF

### Statistics & Insights
- Total trades count
- Win rate calculation
- Total capital used
- Total profit/loss
- Average P/L per trade
- Best and worst trades
- Performance over time chart

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **date-fns** - Date formatting
- **lucide-react** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd MarketSync
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketsync
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

For MongoDB Atlas, use your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketsync
```

## 🏃 Running the Application

### Start the Server
```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

The server will run on http://localhost:5000

### Start the Client
```bash
cd client
npm start
```

The client will run on http://localhost:3000

## 📁 Project Structure

```
MarketSync/
├── client/                      # React frontend
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── TradeEntryForm.js
│   │   │   ├── TradeList.js
│   │   │   ├── SummaryStats.js
│   │   │   └── ExportModal.js
│   │   ├── context/           # React context
│   │   │   └── AuthContext.js
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Express backend
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   └── tradeController.js
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   └── Trade.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   └── validators.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   └── tradeRoutes.js
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
└── README.md
```

## 🔌 API Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Trades (Protected - Requires Authentication)
- `GET /api/trades` - Get all trades for logged-in user
- `GET /api/trades/:id` - Get a specific trade
- `POST /api/trades` - Create a new trade
- `PUT /api/trades/:id` - Update a trade
- `DELETE /api/trades/:id` - Delete a trade
- `GET /api/trades/stats` - Get statistics

### Example Response
```json
{
  "_id": "...",
  "tradeDateTime": "2025-01-15T10:30:00.000Z",
  "stockName": "NIFTY 25900 PE",
  "capitalUsed": 10000,
  "entryPrice": 200.50,
  "exitPrice": 220.75,
  "stopLoss": 190.00,
  "targetPrice": 230.00,
  "quantity": 50,
  "profitLoss": 1012.50,
  "tradeType": "Buy",
  "learningNote": "Strong support at 190, good entry point.",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

## 🎨 UI Features

### Dashboard
- Summary cards showing key metrics
- Interactive performance chart
- Trade list with search and filters
- Sort by date, P/L, or stock name
- Export functionality

### Trade Entry
- Comprehensive form with all trade details
- Auto-filled date/time
- Dropdown for trade type
- Learning notes textarea
- Form validation

## 🔐 Security & Best Practices

- Input validation on both client and server
- CORS enabled for development
- Environment variables for sensitive data
- Error handling middleware
- Mongoose schema validation

## 🚀 Deployment

MarketSync can be deployed to various platforms. See the detailed deployment guides:

- **[Quick Deployment Guide](DEPLOY_QUICK.md)** - Fastest way to deploy (Railway + Vercel)
- **[Step-by-Step Deployment](DEPLOY_STEPS.md)** - Detailed instructions
- **[Full Deployment Guide](DEPLOYMENT.md)** - Comprehensive deployment options

### Quick Deploy (5 minutes)
1. Deploy backend to [Railway](https://railway.app)
2. Deploy frontend to [Vercel](https://vercel.com)
3. Setup MongoDB Atlas (free tier available)
4. Configure environment variables
5. Done! 🎉

See [DEPLOY_QUICK.md](DEPLOY_QUICK.md) for detailed steps.

---

## 🚧 Future Enhancements

- [x] User authentication
- [x] Cookie-based authentication
- [x] Automatic profit/loss calculation
- [x] Zerodha charges calculation (Stock & Option)
- [x] Charges breakdown table
- [x] Trade history with charges column
- [ ] Multiple portfolios
- [ ] Advanced analytics and insights
- [ ] Zerodha API integration
- [ ] AI-powered trade analysis
- [ ] Trade templates
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, please open an issue on the GitHub repository.

---

Built with ❤️ for traders who believe in continuous improvement and disciplined trading.

