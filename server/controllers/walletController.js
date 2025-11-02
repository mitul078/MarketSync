const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Initialize wallet for new user
exports.createWallet = async (userId) => {
  try {
    const existingWallet = await Wallet.findOne({ user: userId });
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = new Wallet({ user: userId, balance: 0 });
    await wallet.save();
    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await exports.createWallet(req.user._id);
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
};

// Add funds to wallet
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be greater than 0.' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      wallet = await exports.createWallet(req.user._id);
    }

    // Update balance
    wallet.balance += amount;
    wallet.totalAdded += amount;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'deposit',
      amount: amount,
      description: `Added funds to wallet`
    });
    await transaction.save();

    res.json({
      message: 'Funds added successfully',
      balance: wallet.balance
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add funds',
      message: error.message
    });
  }
};

// Withdraw funds from wallet
exports.withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be greater than 0.' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update balance
    wallet.balance -= amount;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount: amount,
      description: `Withdrew funds from wallet`
    });
    await transaction.save();

    res.json({
      message: 'Funds withdrawn successfully',
      balance: wallet.balance
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to withdraw funds',
      message: error.message
    });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
};

exports.updateBalanceOnTrade = async (userId, capitalUsed, profitLoss, type, tradeId = null) => {
  try {
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await exports.createWallet(userId);
    }

    // Net change is just the profit/loss
    // Capital is used (deducted) but then returned, so only profit/loss affects final balance
    const profitLossAmount = parseFloat(profitLoss) || 0;
    wallet.balance += profitLossAmount; // Add profit/loss to balance
    await wallet.save();

    // Create transaction record for the profit/loss
    const transaction = new Transaction({
      user: userId,
      type: profitLossAmount >= 0 ? 'deposit' : 'withdrawal',
      amount: Math.abs(profitLossAmount),
      description: profitLossAmount >= 0
        ? `Trade profit: ₹${profitLossAmount.toFixed(2)} (Capital used: ₹${parseFloat(capitalUsed).toFixed(2)})`
        : `Trade loss: ₹${Math.abs(profitLossAmount).toFixed(2)} (Capital used: ₹${parseFloat(capitalUsed).toFixed(2)})`,
      trade: tradeId
    });
    await transaction.save();

    return wallet;
  } catch (error) {
    console.error('Error updating balance on trade:', error);
    throw error;
  }
};


exports.refundTrade = async (userId, capitalUsed, profitLoss, tradeId = null) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance -= profitLoss;

    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      type: 'deposit',
      amount: parseFloat(capitalUsed) || 0,
      description: `Refund for deleted trade (Capital: ₹${capitalUsed.toFixed(2)}, P/L: ₹${profitLossAmount.toFixed(2)})`,
      trade: tradeId
    });
    await transaction.save();

    // Create separate transaction for reversing profit/loss if it was non-zero
    if (profitLossAmount !== 0) {
      const reverseTransaction = new Transaction({
        user: userId,
        type: profitLossAmount > 0 ? 'withdrawal' : 'deposit',
        amount: Math.abs(profitLossAmount),
        description: `Reversed trade P/L: ₹${profitLossAmount.toFixed(2)}`,
        trade: tradeId
      });
      await reverseTransaction.save();
    }

    return wallet;
  } catch (error) {
    console.error('Error refunding trade:', error);
    throw error;
  }
};




