const express = require('express');
const router = express.Router();
const {
  getAllTrades,
  getTradeById,
  createTrade,
  updateTrade,
  deleteTrade,
  getStatistics,
} = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// All trade routes require authentication
router.use(auth);

// Statistics endpoint
router.get('/stats', getStatistics);

// CRUD routes
router.get('/', getAllTrades);
router.get('/:id', getTradeById);
router.post('/', createTrade);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

module.exports = router;

