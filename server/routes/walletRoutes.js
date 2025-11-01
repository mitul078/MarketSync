const express = require('express');
const router = express.Router();
const {
  getBalance,
  addFunds,
  withdrawFunds,
  getTransactions
} = require('../controllers/walletController');
const auth = require('../middleware/auth');

// All wallet routes require authentication
router.use(auth);

router.get('/balance', getBalance);
router.post('/add', addFunds);
router.post('/withdraw', withdrawFunds);
router.get('/transactions', getTransactions);

module.exports = router;





