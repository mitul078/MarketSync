import React, { useState } from 'react';
import { DollarSign, Wallet, RotateCcw, History } from 'lucide-react';
import { useToast } from './Toast';
import TransactionsPanel from './TransactionsPanel';

const AddFunds = ({ onAdd, onReset, balance }) => {
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onAdd(parseFloat(amount));
      setAmount('');
      toast.success('Funds added successfully!');
      // Refresh transactions if panel is open
      if (showTransactions) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add funds. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    toast.confirm(
      `Are you sure you want to reset your wallet balance to zero? This will remove ₹${(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from your wallet. This action cannot be undone.`,
      async () => {
        setResetting(true);
        try {
          await onReset();
          toast.success('Wallet reset to zero successfully!');
          // Refresh transactions if panel is open
          if (showTransactions) {
            setRefreshTrigger(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error resetting wallet:', error);
          const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to reset wallet. Please try again.';
          toast.error(errorMessage);
        } finally {
          setResetting(false);
        }
      }
    );
  };

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <>
    <div className="card max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center justify-center flex-1">
          <div className="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <button
          onClick={() => setShowTransactions(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="View Transactions"
        >
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Add Funds to Wallet
      </h2>
      
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Current Balance</p>
        <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
          ₹{(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || resetting}
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

      {/* Reset Wallet Section */}
      {(balance || 0) > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Reset your wallet balance to zero
            </p>
            <button
              onClick={handleReset}
              disabled={resetting || loading}
              className="px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {resetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 dark:border-red-400"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Reset Wallet to Zero
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
    
    {/* Transactions Panel */}
    <TransactionsPanel 
      isOpen={showTransactions} 
      onClose={() => setShowTransactions(false)}
      refreshTrigger={refreshTrigger}
    />
    </>
  );
};

export default AddFunds;




