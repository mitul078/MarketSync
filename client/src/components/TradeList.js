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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trade History</h2>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-secondary flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by stock or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm sm:text-base flex-1"
              >
                <option value="date">Date</option>
                <option value="profitLoss">P/L</option>
                <option value="stockName">Stock Name</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Trade List */}
        {filteredAndSortedTrades.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No trades found</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2 px-4">
              {trades.length === 0 ? 'Start by logging your first trade!' : 'Try adjusting your search filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Date</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Stock</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Type</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Qty</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Entry</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Exit</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Charges</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">P/L</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap hidden lg:table-cell">Learning</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredAndSortedTrades.map((trade) => {
                    const profitLoss = parseFloat(trade.profitLoss);
                    const isProfit = profitLoss >= 0;
                    
                    return (
                      <tr
                        key={trade._id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          <span className="block">{format(new Date(trade.tradeDateTime), 'MMM dd, yyyy')}</span>
                          <span className="block text-xs text-gray-500">{format(new Date(trade.tradeDateTime), 'HH:mm')}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                          {trade.stockName}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                            trade.tradeType === 'Buy'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {trade.tradeType}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {trade.quantity}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatCurrency(parseFloat(trade.entryPrice))}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatCurrency(parseFloat(trade.exitPrice))}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm text-red-600 dark:text-red-400 whitespace-nowrap">
                          {formatCurrency(parseFloat(trade.totalCharges || 0))}
                        </td>
                        <td className={`py-3 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm font-semibold whitespace-nowrap ${
                          isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(profitLoss)}
                          {trade.grossProfit !== undefined && trade.grossProfit !== trade.profitLoss && (
                            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Gross: {formatCurrency(parseFloat(trade.grossProfit || 0))}
                            </span>
                          )}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate hidden lg:table-cell">
                          {trade.learningNote || 'No notes'}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this trade?')) {
                                onDelete(trade._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete trade"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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


