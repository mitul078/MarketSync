import React, { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

const ExportModal = ({ trades, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [generating, setGenerating] = useState(false);

  const exportToCSV = () => {
    const headers = [
      'Date', 'Stock Name', 'Type', 'Quantity', 'Capital Used', 
      'Entry Price', 'Exit Price', 'Stop Loss', 'Target Price', 
      'P/L', 'Learning Notes'
    ];

    const rows = trades.map(trade => [
      trade.tradeDateTime,
      trade.stockName,
      trade.tradeType,
      trade.quantity,
      trade.capitalUsed,
      trade.entryPrice,
      trade.exitPrice,
      trade.stopLoss || '',
      trade.targetPrice || '',
      trade.profitLoss,
      trade.learningNote || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-journal-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    setGenerating(true);
    
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Trading Journal', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Summary Stats
    const totalTrades = trades.length;
    const totalPL = trades.reduce((sum, t) => sum + parseFloat(t.profitLoss), 0);
    const wins = trades.filter(t => parseFloat(t.profitLoss) > 0).length;
    const winRate = totalTrades > 0 ? (wins / totalTrades * 100).toFixed(1) : 0;

    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Trades: ${totalTrades}`, 20, yPos);
    yPos += 7;
    doc.text(`Win Rate: ${winRate}%`, 20, yPos);
    yPos += 7;
    doc.text(`Total P/L: ₹${totalPL.toFixed(2)}`, 20, yPos);
    yPos += 15;

    // Table Headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const headers = ['Date', 'Stock', 'Type', 'Qty', 'Entry', 'Exit', 'P/L', 'Notes'];
    const colWidths = [25, 30, 15, 15, 20, 20, 25, 30];
    let xPos = 10;

    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });

    yPos += 10;

    // Trade Rows
    doc.setFont('helvetica', 'normal');
    trades.forEach((trade, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      xPos = 10;
      const rowData = [
        new Date(trade.tradeDateTime).toLocaleDateString(),
        trade.stockName.substring(0, 12),
        trade.tradeType,
        trade.quantity,
        `₹${parseFloat(trade.entryPrice).toFixed(0)}`,
        `₹${parseFloat(trade.exitPrice).toFixed(0)}`,
        `₹${parseFloat(trade.profitLoss).toFixed(2)}`,
        trade.learningNote ? trade.learningNote.substring(0, 20) : '-',
      ];

      rowData.forEach((cell, i) => {
        doc.text(cell, xPos, yPos);
        xPos += colWidths[i];
      });

      yPos += 8;
    });

    doc.save(`trading-journal-${new Date().toISOString().split('T')[0]}.pdf`);
    setGenerating(false);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Export Trades
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Export Format</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  exportFormat === 'csv'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <div className="font-medium text-gray-900 dark:text-white">CSV</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Excel compatible</div>
              </button>

              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  exportFormat === 'pdf'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <div className="font-medium text-gray-900 dark:text-white">PDF</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Formatted report</div>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>{trades.length}</strong> {trades.length === 1 ? 'trade' : 'trades'} will be exported
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={generating}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn-primary"
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;


