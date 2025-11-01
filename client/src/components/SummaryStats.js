import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SummaryStats = ({ trades }) => {
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        totalCapital: 0,
        totalProfitLoss: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgProfitLoss: 0,
        bestTrade: 0,
        worstTrade: 0,
      };
    }

    const totalProfitLoss = trades.reduce((sum, trade) => sum + parseFloat(trade.profitLoss), 0);
    const wins = trades.filter(trade => parseFloat(trade.profitLoss) > 0).length;
    const losses = trades.filter(trade => parseFloat(trade.profitLoss) < 0).length;
    const totalCapital = trades.reduce((sum, trade) => sum + parseFloat(trade.capitalUsed), 0);
    const winRate = (wins / trades.length) * 100;
    const avgProfitLoss = totalProfitLoss / trades.length;

    const profitLossValues = trades.map(trade => parseFloat(trade.profitLoss));
    const bestTrade = Math.max(...profitLossValues);
    const worstTrade = Math.min(...profitLossValues);

    return {
      totalTrades: trades.length,
      totalCapital,
      totalProfitLoss,
      wins,
      losses,
      winRate,
      avgProfitLoss,
      bestTrade,
      worstTrade,
    };
  }, [trades]);

  const chartData = useMemo(() => {
    if (trades.length === 0) return [];

    return trades
      .sort((a, b) => new Date(a.tradeDateTime) - new Date(b.tradeDateTime))
      .map((trade, index) => ({
        trade: index + 1,
        date: new Date(trade.tradeDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pnl: parseFloat(trade.profitLoss),
        cumulative: trades
          .slice(0, index + 1)
          .reduce((sum, t) => sum + parseFloat(t.profitLoss), 0),
      }));
  }, [trades]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Trades',
      value: stats.totalTrades,
      icon: Target,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Capital Used',
      value: formatCurrency(stats.totalCapital),
      icon: DollarSign,
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Total P/L',
      value: formatCurrency(stats.totalProfitLoss),
      icon: TrendingUp,
      bgColor: stats.totalProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500',
      valueColor: stats.totalProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: Award,
      bgColor: 'bg-amber-500',
      subtitle: `${stats.wins}W / ${stats.losses}L`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.valueColor || 'text-gray-900 dark:text-white'}`}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      {trades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average P/L per Trade</p>
            <p className={`text-xl font-bold ${
              stats.avgProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(stats.avgProfitLoss)}
            </p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Trade</p>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(stats.bestTrade)}
            </p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Worst Trade</p>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(stats.worstTrade)}
            </p>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      {trades.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="date" 
                className="text-gray-600 dark:text-gray-400"
                style={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                style={{ fill: 'currentColor' }}
                tickFormatter={(value) => `₹${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#374151'
                }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                name="Cumulative P/L"
                dot={{ fill: '#0ea5e9', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Trade P/L"
                dot={{ fill: '#8b5cf6', r: 3 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {trades.length === 0 && (
        <div className="card text-center py-12">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No trades recorded yet
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Start tracking your trading journey by logging your first trade!
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryStats;


