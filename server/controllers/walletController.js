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


exports.refundTrade = async (userId, capitalUsed, profitLoss, totalCharges = 0, tradeId = null) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Convert profitLoss to number for calculations
    const profitLossAmount = parseFloat(profitLoss) || 0;

    // Simply reverse the profit/loss that was added when trade was created
    // When trade was created: balance += profitLoss (net profit after charges)
    // When trade is deleted: balance -= profitLoss (reverse it)
    // Note: Charges are already included in profitLoss (netProfit = grossProfit - charges)
    wallet.balance -= profitLossAmount;
    await wallet.save();

    // Create transaction record for reversing the profit/loss
    if (profitLossAmount !== 0) {
      const reverseTransaction = new Transaction({
        user: userId,
        type: profitLossAmount > 0 ? 'withdrawal' : 'deposit',
        amount: Math.abs(profitLossAmount),
        description: `Reversed trade P/L: ₹${profitLossAmount.toFixed(2)} (Trade deleted)`,
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

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
};

// Reset wallet balance to zero
exports.resetWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const previousBalance = wallet.balance;

    if (previousBalance === 0) {
      return res.status(400).json({ error: 'Wallet balance is already zero' });
    }

    // Reset balance to zero
    wallet.balance = 0;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount: previousBalance,
      description: `Wallet reset to zero (Previous balance: ₹${previousBalance.toFixed(2)})`
    });
    await transaction.save();

    res.json({
      message: 'Wallet reset to zero successfully',
      balance: wallet.balance
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to reset wallet',
      message: error.message
    });
  }
};




