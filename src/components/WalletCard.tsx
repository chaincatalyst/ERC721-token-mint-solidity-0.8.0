import React from 'react';
import { ExternalLink, TrendingUp, Twitter, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { KOLWallet } from '../types';
import { useWalletStore } from '../store/walletStore';

interface WalletCardProps {
  wallet: KOLWallet;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const { sortOption, setSortOption, timeRange, setTimeRange } = useWalletStore();

  const sortedTrades = [...wallet.trades].sort((a, b) => {
    if (sortOption === 'recent') {
      return b.timestamp - a.timestamp;
    } else if (sortOption === 'profit') {
      return (b.pnl || 0) - (a.pnl || 0);
    } else {
      return (a.pnl || 0) - (b.pnl || 0);
    }
  });

  return (
    <div className="mac-panel p-4 mac-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={wallet.avatar} 
            alt={wallet.name} 
            className="w-12 h-12 rounded-full ring-1 ring-[var(--mac-border)]" 
          />
          <div>
            <h3 className="mac-title mb-1">{wallet.name}</h3>
            <p className="text-xs text-[var(--mac-text-secondary)]">{wallet.description}</p>
            <div className="flex space-x-2 mt-2">
              <a href={wallet.twitter} className="mac-button flex items-center space-x-1">
                <Twitter size={12} />
                <span>Twitter</span>
              </a>
              <a href={wallet.telegram} className="mac-button flex items-center space-x-1">
                <MessageCircle size={12} />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
        <a
          href={`https://solscan.io/account/${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button"
        >
          <ExternalLink size={12} className="inline mr-1" />
          View
        </a>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="mac-title text-sm flex items-center">
            <TrendingUp size={14} className="mr-1 text-[var(--mac-highlight)]" />
            Performance
          </h4>
          <div className="flex space-x-1">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`mac-button text-xs ${timeRange === days ? 'active' : ''}`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wallet.historicalPnL}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--mac-highlight)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--mac-highlight)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="var(--mac-highlight)"
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trades */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="mac-title text-sm">Recent Trades</h4>
          <div className="flex space-x-1">
            {[
              { key: 'recent', label: 'Recent' },
              { key: 'profit', label: 'Profit' },
              { key: 'loss', label: 'Loss' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortOption(key as any)}
                className={`mac-button text-xs ${sortOption === key ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <table className="mac-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Price</th>
              <th>P/L</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map((trade, index) => (
              <tr key={index}>
                <td>
                  <div className="flex items-center space-x-2">
                    <img src={trade.tokenIcon} alt={trade.token} className="w-4 h-4" />
                    <span>{trade.token}</span>
                  </div>
                </td>
                <td className={trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}>
                  {trade.type === 'buy' ? 'Buy' : 'Sell'}
                </td>
                <td>{trade.amount.toLocaleString()}</td>
                <td>${trade.price}</td>
                <td className={trade.pnl && trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {trade.pnl && trade.pnl >= 0 ? '+' : ''}{trade.pnl?.toLocaleString()} USD
                </td>
                <td className="text-[var(--mac-text-secondary)]">
                  {formatDistanceToNow(trade.timestamp, { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};