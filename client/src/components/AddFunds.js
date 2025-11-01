import React, { useState } from 'react';
import { DollarSign, Wallet } from 'lucide-react';

const AddFunds = ({ onAdd, balance }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onAdd(parseFloat(amount));
      setAmount('');
      alert('Funds added successfully!');
    } catch (error) {
      console.error('Error adding funds:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add funds. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
          <Wallet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Add Funds to Wallet
      </h2>
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Balance</p>
        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2">
          <DollarSign className="w-8 h-8" />
          {(balance || 0).toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="label">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            placeholder="Enter amount"
            min="1"
            step="0.01"
            required
          />
        </div>

        <div>
          <p className="label mb-2">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Adding funds...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Add Funds
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFunds;




