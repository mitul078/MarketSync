const express = require('express');
const router = express.Router();
const {
  getBalance,
  addFunds,
  resetWallet,
  getTransactions
} = require('../controllers/walletController');
const auth = require('../middleware/auth');

// All wallet routes require authentication
router.use(auth);

// Wallet routes
router.get('/balance', getBalance);
router.get('/transactions', getTransactions);
router.post('/add', addFunds);
router.post('/reset', resetWallet);

module.exports = router;








