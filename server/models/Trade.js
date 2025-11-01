const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tradeDateTime: {
    type: Date,
    required: true,
  },
  entryTime: {
    type: Date,
    required: true,
  },
  exitTime: {
    type: Date,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
    trim: true,
  },
  capitalUsed: {
    type: Number,
    required: true,
    min: 0,
  },
  entryPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  exitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stopLoss: {
    type: Number,
    default: null,
  },
  targetPrice: {
    type: Number,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  profitLoss: {
    type: Number,
    required: true,
  },
  grossProfit: {
    type: Number,
    default: 0,
  },
  netProfit: {
    type: Number,
    default: 0,
  },
  totalCharges: {
    type: Number,
    default: 0,
  },
  tradeType: {
    type: String,
    enum: ['Buy', 'Sell'],
    required: true,
  },
  instrumentType: {
    type: String,
    enum: ['Stock', 'Option'],
    default: 'Stock',
  },
  learningNote: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
tradeSchema.index({ user: 1, tradeDateTime: -1 });
tradeSchema.index({ user: 1, stockName: 1 });
tradeSchema.index({ user: 1, profitLoss: -1 });

module.exports = mongoose.model('Trade', tradeSchema);

