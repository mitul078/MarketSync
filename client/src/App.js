import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, LogOut, User, Wallet } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import TradeEntryForm from './components/TradeEntryForm';
import TradeList from './components/TradeList';
import SummaryStats from './components/SummaryStats';
import AddFunds from './components/AddFunds';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from 'axios';

function App() {
  const { user, isAuthenticated, loading, login, signup, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [trades, setTrades] = useState([]);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
      document.documentElement.classList.toggle('dark', JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const fetchTrades = useCallback(async () => {
    setTradesLoading(true);
    try {
      const response = await axios.get('/api/trades');
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
      // If unauthorized, logout
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setTradesLoading(false);
    }
  }, [logout]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get('/api/wallet/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrades();
      fetchBalance();
    }
  }, [isAuthenticated, fetchTrades, fetchBalance]);

  const handleTradeSubmit = async (tradeData) => {
    try {
      const response = await axios.post('/api/trades', tradeData);
      setTrades([response.data, ...trades]);
      fetchBalance(); // Refresh balance after trade
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error creating trade:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to save trade. Please try again.';
        alert(errorMsg);
      }
    }
  };

  const handleTradeDelete = async (id) => {
    try {
      await axios.delete(`/api/trades/${id}`);
      setTrades(trades.filter(trade => trade._id !== id));
      fetchBalance(); // Refresh balance after deletion (refund)
    } catch (error) {
      console.error('Error deleting trade:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        alert('Failed to delete trade. Please try again.');
      }
    }
  };

  const handleAddFunds = async (amount) => {
    try {
      const response = await axios.post('/api/wallet/add', { amount });
      setBalance(response.data.balance);
      return response.data;
    } catch (error) {
      console.error('Error adding funds:', error);
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    setTrades([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show authentication pages if not logged in
  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login onLogin={handleLogin} switchToSignup={() => setAuthMode('signup')} />
    ) : (
      <Signup onSignup={handleSignup} switchToLogin={() => setAuthMode('login')} />
    );
  }

  // Main application
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">MarketSync</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Your Personal Trading Journal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 sm:gap-3 bg-primary-50 dark:bg-primary-900/20 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Balance</p>
                  <p className="text-sm sm:text-lg font-bold text-primary-600 dark:text-primary-400">
                    ₹{(balance || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{user?.name || user?.username}</span>
                <span className="text-xs sm:hidden font-medium truncate max-w-[80px]">{user?.name || user?.username}</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-red-600 dark:text-red-400"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-fit overflow-x-auto sm:overflow-visible">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('new-trade')}
            className={`px-3 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'new-trade'
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            New Trade
          </button>
          <button
            onClick={() => setActiveTab('add-funds')}
            className={`px-3 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'add-funds'
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
            Wallet
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {tradesLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400">Loading trades...</div>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-4 sm:space-y-6">
            <SummaryStats trades={trades} />
            <TradeList trades={trades} onDelete={handleTradeDelete} />
          </div>
        ) : activeTab === 'new-trade' ? (
          <TradeEntryForm onSubmit={handleTradeSubmit} balance={balance} />
        ) : (
          <AddFunds onAdd={handleAddFunds} balance={balance} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          © 2025 MarketSync. Build your trading discipline, one trade at a time.
        </div>
      </footer>
    </div>
  );
}

export default App;
