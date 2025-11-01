import React, { useState } from 'react';
import { Save, TrendingUp, Wallet } from 'lucide-react';

const TradeEntryForm = ({ onSubmit, balance }) => {
  const [formData, setFormData] = useState({
    tradeDateTime: new Date().toISOString().slice(0, 16),
    entryTime: new Date().toISOString().slice(0, 16),
    exitTime: new Date().toISOString().slice(0, 16),
    stockName: '',
    capitalUsed: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    targetPrice: '',
    quantity: '',
    profitLoss: '',
    grossProfit: '',
    netProfit: '',
    totalCharges: '',
    tradeType: 'Buy',
    instrumentType: 'Stock', // Stock or Option
    learningNote: '',
  });

  // Calculate Zerodha trading charges based on instrument type (Stock or Option)
  const calculateTradingCharges = (entryPrice, exitPrice, quantity, tradeType, instrumentType) => {
    if (!entryPrice || !exitPrice || !quantity) {
      return {
        brokerage: 0,
        stt: 0,
        exchangeTxn: 0,
        sebiCharges: 0,
        stampDuty: 0,
        gst: 0,
        totalCharges: 0
      };
    }
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = parseFloat(quantity);
    
    if (isNaN(entry) || isNaN(exit) || isNaN(qty) || qty <= 0) {
      return {
        brokerage: 0,
        stt: 0,
        exchangeTxn: 0,
        sebiCharges: 0,
        stampDuty: 0,
        gst: 0,
        totalCharges: 0
      };
    }

    // Turnover = (Entry Price + Exit Price) × Quantity
    const turnover = (entry + exit) * qty;
    const capitalUsed = entry * qty; // For brokerage calculation

    let brokerage, stt, exchangeTxn, sebiCharges, stampDuty, gst;

    if (instrumentType === 'Option') {
      // OPTION TRADING CHARGES
      // Brokerage: (0.03% of Turnover × 2 sides) but capped at ₹40
      const brokeragePercent = (capitalUsed * 0.0003) * 2; // 0.03% of capital × 2 sides
      brokerage = Math.min(brokeragePercent, 40.00); // Capped at ₹40

      // STT: ExitPrice × Qty × 0.00025
      stt = exit * qty * 0.00025;

      // Exchange Transaction Charges: Turnover × 0.0000345
      exchangeTxn = turnover * 0.0000345;

      // SEBI Charges: Turnover × 0.000001
      sebiCharges = turnover * 0.000001;

      // Stamp Duty: EntryPrice × Qty × 0.00003
      stampDuty = entry * qty * 0.00003;

      // GST: 18% of (Brokerage + Exchange Txn)
      gst = (brokerage + exchangeTxn) * 0.18;
    } else {
      // STOCK TRADING CHARGES
      // Brokerage: ₹0 (buy) + ₹20 (sell) = ₹20 per trade
      brokerage = 20.00;

      // STT: ExitPrice × Qty × 0.000625
      stt = exit * qty * 0.000625;

      // Exchange Transaction Charges: Turnover × 0.0005
      exchangeTxn = turnover * 0.0005;

      // SEBI Charges: Turnover × 0.000001
      sebiCharges = turnover * 0.000001;

      // Stamp Duty: EntryPrice × Qty × 0.00003
      stampDuty = entry * qty * 0.00003;

      // GST: 18% of (Brokerage + Exchange Txn)
      gst = (brokerage + exchangeTxn) * 0.18;
    }

    // Total Charges
    const totalCharges = brokerage + stt + exchangeTxn + sebiCharges + stampDuty + gst;

    return {
      brokerage: parseFloat(brokerage.toFixed(2)),
      stt: parseFloat(stt.toFixed(2)),
      exchangeTxn: parseFloat(exchangeTxn.toFixed(2)),
      sebiCharges: parseFloat(sebiCharges.toFixed(2)),
      stampDuty: parseFloat(stampDuty.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      totalCharges: parseFloat(totalCharges.toFixed(2)),
      instrumentType: instrumentType
    };
  };

  // Auto-calculate profit/loss and capital used
  const calculateProfitLoss = (entryPrice, exitPrice, quantity, tradeType, instrumentType = 'Stock') => {
    if (!entryPrice || !exitPrice || !quantity) {
      return {
        gross: 0,
        net: 0,
        charges: calculateTradingCharges('', '', '', '', instrumentType)
      };
    }
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = parseFloat(quantity);
    
    if (isNaN(entry) || isNaN(exit) || isNaN(qty) || qty <= 0) {
      return {
        gross: 0,
        net: 0,
        charges: calculateTradingCharges('', '', '', '', instrumentType)
      };
    }
    
    // For Buy: Gross Profit = (Exit Price - Entry Price) * Quantity
    // For Sell: Gross Profit = (Entry Price - Exit Price) * Quantity
    const grossProfit = tradeType === 'Buy' 
      ? (exit - entry) * qty 
      : (entry - exit) * qty;
    
    // Calculate trading charges based on instrument type
    const charges = calculateTradingCharges(entryPrice, exitPrice, quantity, tradeType, instrumentType);
    
    // Net Profit = Gross Profit - Total Charges
    const netProfit = grossProfit - charges.totalCharges;
    
    return {
      gross: parseFloat(grossProfit.toFixed(2)),
      net: parseFloat(netProfit.toFixed(2)),
      charges: charges
    };
  };

  // Calculate charges and profit/loss whenever relevant fields change
  const getCalculatedValues = () => {
    if (!formData.entryPrice || !formData.exitPrice || !formData.quantity) {
      return {
        profitLoss: '',
        grossProfit: 0,
        netProfit: 0,
        totalCharges: 0,
        charges: calculateTradingCharges('', '', '', '')
      };
    }

    const profitData = calculateProfitLoss(
      formData.entryPrice,
      formData.exitPrice,
      formData.quantity,
      formData.tradeType,
      formData.instrumentType
    );

    return {
      profitLoss: profitData.net, // Use net profit for balance updates
      grossProfit: profitData.gross,
      netProfit: profitData.net,
      totalCharges: profitData.charges.totalCharges,
      charges: profitData.charges
    };
  };

  const calculatedValues = getCalculatedValues();

  // Auto-calculate capital used
  const calculateCapitalUsed = (entryPrice, quantity) => {
    if (!entryPrice || !quantity) return '';
    
    const entry = parseFloat(entryPrice);
    const qty = parseFloat(quantity);
    
    if (isNaN(entry) || isNaN(qty) || qty <= 0) return '';
    
    // Capital Used = Entry Price * Quantity
    return (entry * qty).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedData = {
      ...formData,
      [name]: value
    };

    // Auto-calculate when entry price, exit price, quantity, trade type, or instrument type changes
    if (name === 'entryPrice' || name === 'exitPrice' || name === 'quantity' || name === 'tradeType' || name === 'instrumentType') {
      const entryPrice = name === 'entryPrice' ? value : updatedData.entryPrice;
      const exitPrice = name === 'exitPrice' ? value : updatedData.exitPrice;
      const quantity = name === 'quantity' ? value : updatedData.quantity;
      const tradeType = name === 'tradeType' ? value : updatedData.tradeType;
      const instrumentType = name === 'instrumentType' ? value : updatedData.instrumentType;

      // Calculate profit/loss (includes charges calculation)
      const profitData = calculateProfitLoss(entryPrice, exitPrice, quantity, tradeType, instrumentType);
      if (profitData.gross !== undefined) {
        updatedData.profitLoss = profitData.net; // Store net profit for balance updates
        updatedData.grossProfit = profitData.gross;
        updatedData.netProfit = profitData.net;
        updatedData.totalCharges = profitData.charges.totalCharges;
      }

      // Auto-calculate capital used when entry price or quantity changes
      if (name === 'entryPrice' || name === 'quantity') {
        const calculatedCapital = calculateCapitalUsed(entryPrice, quantity);
        updatedData.capitalUsed = calculatedCapital;
      }
    }

    // Auto-calculate capital used when entry price or quantity changes
    if (name === 'entryPrice' || name === 'quantity') {
      const entryPrice = name === 'entryPrice' ? value : updatedData.entryPrice;
      const quantity = name === 'quantity' ? value : updatedData.quantity;
      const calculatedCapital = calculateCapitalUsed(entryPrice, quantity);
      updatedData.capitalUsed = calculatedCapital;
      
      // Recalculate profit/loss if exit price exists
      if (updatedData.exitPrice) {
        const profitData = calculateProfitLoss(entryPrice, updatedData.exitPrice, quantity, updatedData.tradeType, updatedData.instrumentType);
        if (profitData.gross !== undefined) {
          updatedData.profitLoss = profitData.net;
          updatedData.grossProfit = profitData.gross;
          updatedData.netProfit = profitData.net;
          updatedData.totalCharges = profitData.charges.totalCharges;
        }
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get latest calculated values
    const profitData = calculateProfitLoss(
      formData.entryPrice,
      formData.exitPrice,
      formData.quantity,
      formData.tradeType,
      formData.instrumentType
    );

    // Ensure numeric values are properly converted
    const submitData = {
      ...formData,
      capitalUsed: parseFloat(formData.capitalUsed) || 0,
      entryPrice: parseFloat(formData.entryPrice) || 0,
      exitPrice: parseFloat(formData.exitPrice) || 0,
      quantity: parseFloat(formData.quantity) || 0,
      profitLoss: profitData && profitData.net !== undefined ? profitData.net : parseFloat(formData.profitLoss) || 0, // Use net profit
      grossProfit: profitData && profitData.gross !== undefined ? profitData.gross : parseFloat(formData.grossProfit) || 0,
      netProfit: profitData && profitData.net !== undefined ? profitData.net : parseFloat(formData.netProfit) || 0,
      totalCharges: profitData && profitData.charges ? profitData.charges.totalCharges : parseFloat(formData.totalCharges) || 0,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : null,
    };
    
    onSubmit(submitData);
    // Reset form
    setFormData({
      tradeDateTime: new Date().toISOString().slice(0, 16),
      entryTime: new Date().toISOString().slice(0, 16),
      exitTime: new Date().toISOString().slice(0, 16),
      stockName: '',
      capitalUsed: '',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      targetPrice: '',
      quantity: '',
      profitLoss: '',
      tradeType: 'Buy',
      learningNote: '',
    });
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          Log New Trade
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="tradeDateTime" className="label">
              Trade Date
            </label>
            <input
              type="date"
              id="tradeDateTime"
              name="tradeDateTime"
              value={formData.tradeDateTime.split('T')[0]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tradeDateTime: e.target.value + 'T' + prev.tradeDateTime.split('T')[1]
              }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="entryTime" className="label">
              Entry Time
            </label>
            <input
              type="datetime-local"
              id="entryTime"
              name="entryTime"
              value={formData.entryTime}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="exitTime" className="label">
              Exit Time
            </label>
            <input
              type="datetime-local"
              id="exitTime"
              name="exitTime"
              value={formData.exitTime}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="stockName" className="label">
              Stock / Option Name
            </label>
            <input
              type="text"
              id="stockName"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., NIFTY 25900 PE"
              required
            />
          </div>

          <div>
            <label htmlFor="instrumentType" className="label">
              Instrument Type
            </label>
            <select
              id="instrumentType"
              name="instrumentType"
              value={formData.instrumentType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="Stock">Stock</option>
              <option value="Option">Option</option>
            </select>
          </div>

          <div>
            <label htmlFor="tradeType" className="label">
              Trade Type
            </label>
            <select
              id="tradeType"
              name="tradeType"
              value={formData.tradeType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="label">
              Quantity / Lot Size
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 50"
              required
            />
          </div>

          <div>
            <label htmlFor="capitalUsed" className="label">
              Capital Used (₹) <span className="text-xs text-gray-500">(Auto-calculated: Entry Price × Quantity)</span>
            </label>
            <input
              type="number"
              id="capitalUsed"
              name="capitalUsed"
              value={formData.capitalUsed}
              onChange={handleChange}
              className="input-field bg-gray-50 dark:bg-gray-800"
              placeholder="Auto-calculated from Entry Price × Quantity"
              step="0.01"
              required
              readOnly
            />
            {formData.entryPrice && formData.quantity && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ₹{formData.entryPrice} × {formData.quantity} = ₹{formData.capitalUsed || '0.00'}
              </p>
            )}
            {parseFloat(formData.capitalUsed || 0) > (balance || 0) && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Insufficient balance! Add more funds.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Available Balance</span>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{(balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="entryPrice" className="label">
              Entry Price (₹)
            </label>
            <input
              type="number"
              id="entryPrice"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 200.50"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="exitPrice" className="label">
              Exit Price (₹)
            </label>
            <input
              type="number"
              id="exitPrice"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 220.75"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="stopLoss" className="label">
              Stop Loss (₹)
            </label>
            <input
              type="number"
              id="stopLoss"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 190.00"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="targetPrice" className="label">
              Target Price (₹)
            </label>
            <input
              type="number"
              id="targetPrice"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 230.00"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="profitLoss" className="label">
              Profit / Loss (₹) <span className="text-xs text-gray-500">(Net Profit after Zerodha charges)</span>
            </label>
            <div className="space-y-4">
              {/* Gross Profit and Charges Summary */}
              {formData.entryPrice && formData.exitPrice && formData.quantity && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gross Profit</p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        ₹{calculatedValues.grossProfit.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formData.tradeType === 'Buy' 
                          ? `(₹${formData.exitPrice} - ₹${formData.entryPrice}) × ${formData.quantity}`
                          : `(₹${formData.entryPrice} - ₹${formData.exitPrice}) × ${formData.quantity}`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Charges</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        ₹{calculatedValues.charges.totalCharges.toFixed(2)}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                        Zerodha Trading Charges
                      </p>
                    </div>
                  </div>

                  {/* Zerodha Charges Breakdown Table */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trading Charges Breakdown (Zerodha - {formData.instrumentType})
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-300 dark:border-gray-600">
                            <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Component</th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700 dark:text-gray-300">Calculation</th>
                            <th className="text-right py-2 px-2 font-medium text-gray-700 dark:text-gray-300">₹</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400">
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">Brokerage</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">
                              {formData.instrumentType === 'Option' 
                                ? '(0.03% of Capital × 2 sides) but capped at ₹40'
                                : '₹0 (buy) + ₹20 (sell)'}
                            </td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.brokerage.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">STT</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">
                              {formData.instrumentType === 'Option' 
                                ? 'ExitPrice × Qty × 0.00025'
                                : 'ExitPrice × Qty × 0.000625'}
                            </td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.stt.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">Exchange Txn</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">
                              {formData.instrumentType === 'Option' 
                                ? 'Turnover × 0.0000345'
                                : 'Turnover × 0.0005'}
                            </td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.exchangeTxn.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">SEBI Charges</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">Turnover × 0.000001</td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.sebiCharges.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">Stamp Duty</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">EntryPrice × Qty × 0.00003</td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.stampDuty.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-1.5 px-2">GST</td>
                            <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-500">18% of (Brokerage + Exchange Txn)</td>
                            <td className="py-1.5 px-2 text-right">{calculatedValues.charges.gst.toFixed(2)}</td>
                          </tr>
                          <tr className="bg-gray-100 dark:bg-gray-700 font-medium">
                            <td className="py-2 px-2">Total Charges</td>
                            <td className="py-2 px-2"></td>
                            <td className="py-2 px-2 text-right text-red-600 dark:text-red-400">
                              ₹{calculatedValues.charges.totalCharges.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Net Profit Display */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Profit</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">(Gross Profit - Total Charges)</span>
                    </div>
                    <input
                      type="number"
                      id="profitLoss"
                      name="profitLoss"
                      value={calculatedValues.netProfit.toFixed(2)}
                      readOnly
                      className={`text-xl font-bold text-right bg-transparent border-none outline-none w-32 ${
                        calculatedValues.netProfit > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : calculatedValues.netProfit < 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Show input field when no values entered */}
              {(!formData.entryPrice || !formData.exitPrice || !formData.quantity) && (
                <input
                  type="number"
                  id="profitLoss"
                  name="profitLoss"
                  value={formData.profitLoss}
                  onChange={handleChange}
                  className="input-field bg-gray-50 dark:bg-gray-800"
                  placeholder="Enter Entry/Exit Prices and Quantity to auto-calculate"
                  step="0.01"
                  required
                  readOnly
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="learningNote" className="label">
            Learning Notes
          </label>
          <textarea
            id="learningNote"
            name="learningNote"
            value={formData.learningNote}
            onChange={handleChange}
            rows="4"
            className="input-field resize-none"
            placeholder="What did you learn from this trade? What went well? What could be improved?"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeEntryForm;

