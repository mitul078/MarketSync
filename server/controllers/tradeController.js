const Trade = require('../models/Trade');
const Wallet = require('../models/Wallet');
const { updateBalanceOnTrade, createWallet, refundTrade } = require('./walletController');

// Get all trades
exports.getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ tradeDateTime: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch trades',
      message: error.message
    });
  }
};

// Get a single trade by ID
exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.user._id });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.json(trade);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch trade',
      message: error.message
    });
  }
};

// Create a new trade
exports.createTrade = async (req, res) => {
  try {
    const { capitalUsed, profitLoss } = req.body;

    // Check wallet balance
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      wallet = await createWallet(req.user._id);
    }

    // Validate sufficient balance (user needs enough capital to make the trade)
    if (wallet.balance < capitalUsed) {
      return res.status(400).json({
        error: 'Insufficient balance',
        message: `Your wallet balance is ₹${wallet.balance.toFixed(2)}, but you need ₹${capitalUsed.toFixed(2)}. Please add funds first.`
      });
    }

    // Create trade
    const trade = new Trade({
      ...req.body,
      user: req.user._id
    });
    const savedTrade = await trade.save();

    // Update wallet balance automatically:
    // When trade completes: capital is returned + profit/loss is added
    // Net effect: balance = balance - capitalUsed + capitalUsed + profitLoss = balance + profitLoss
    // So we just add the profit/loss to balance
    await updateBalanceOnTrade(req.user._id, savedTrade.capitalUsed, savedTrade.profitLoss, 'trade_complete', savedTrade._id);

    res.status(201).json(savedTrade);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create trade',
      message: error.message
    });
  }
};

// Update a trade
exports.updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.json(trade);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to update trade',
      message: error.message
    });
  }
};

// Delete a trade
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.user._id });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    const newBalance = await refundTrade(
      req.user._id,
      trade.capitalUsed,
      trade.profitLoss,
      trade.totalCharges || 0,
      trade._id
    );

    // Delete the trade
    await Trade.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Trade deleted successfully',
      balance: newBalance.balance 
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete trade',
      message: error.message
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalTrades = await Trade.countDocuments({ user: req.user._id });

    const aggregation = await Trade.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalCapital: { $sum: '$capitalUsed' },
          totalProfitLoss: { $sum: '$profitLoss' },
          avgProfitLoss: { $avg: '$profitLoss' },
          wins: {
            $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, 1, 0] }
          },
          losses: {
            $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, 1, 0] }
          },
        }
      }
    ]);

    const stats = aggregation[0] || {
      totalCapital: 0,
      totalProfitLoss: 0,
      avgProfitLoss: 0,
      wins: 0,
      losses: 0,
    };

    stats.totalTrades = totalTrades;
    stats.winRate = totalTrades > 0 ? (stats.wins / totalTrades * 100).toFixed(2) : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

