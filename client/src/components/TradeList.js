import React, { useState, useMemo } from 'react';
import { Trash2, Filter, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import ExportModal from './ExportModal';

const TradeList = ({ trades, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade =>
      trade.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.learningNote.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.tradeDateTime) - new Date(b.tradeDateTime);
      } else if (sortBy === 'profitLoss') {
        comparison = parseFloat(a.profitLoss) - parseFloat(b.profitLoss);
      } else if (sortBy === 'stockName') {
        comparison = a.stockName.localeCompare(b.stockName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [trades, searchTerm, sortBy, sortOrder]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by stock or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="date">Date</option>
                <option value="profitLoss">P/L</option>
                <option value="stockName">Stock Name</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Trade List */}
        {filteredAndSortedTrades.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No trades found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {trades.length === 0 ? 'Start by logging your first trade!' : 'Try adjusting your search filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Entry</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Exit</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Charges</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">P/L</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Learning</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTrades.map((trade) => {
                  const profitLoss = parseFloat(trade.profitLoss);
                  const isProfit = profitLoss >= 0;
                  
                  return (
                    <tr
                      key={trade._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(trade.tradeDateTime), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        {trade.stockName}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.tradeType === 'Buy'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {trade.tradeType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {trade.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(parseFloat(trade.entryPrice))}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(parseFloat(trade.exitPrice))}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-red-600 dark:text-red-400">
                        {formatCurrency(parseFloat(trade.totalCharges || 0))}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${
                        isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(profitLoss)}
                        {trade.grossProfit !== undefined && trade.grossProfit !== trade.profitLoss && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Gross: {formatCurrency(parseFloat(trade.grossProfit || 0))}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {trade.learningNote || 'No notes'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this trade?')) {
                              onDelete(trade._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete trade"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showExportModal && (
        <ExportModal
          trades={filteredAndSortedTrades}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </>
  );
};

export default TradeList;


