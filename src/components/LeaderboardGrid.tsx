import React, { useState, useMemo } from 'react';
import { useWalletStore } from '../store/walletStore';
import { Trophy, TrendingUp, Clock, ExternalLink, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type TimeRange = 'daily' | 'weekly' | 'monthly';
type SortBy = 'pnl' | 'trades' | 'winRate';

export const LeaderboardGrid: React.FC = () => {
  const { wallets } = useWalletStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [sortBy, setSortBy] = useState<SortBy>('pnl');
  const [showFilters, setShowFilters] = useState(false);

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      const now = Date.now();
      const timeRangeInDays = timeRange === 'daily' ? 1 : timeRange === 'weekly' ? 7 : 30;
      const startTime = now - timeRangeInDays * 24 * 60 * 60 * 1000;

      const getPnL = (wallet: typeof wallets[0]) => {
        return wallet.historicalPnL
          .filter(day => new Date(day.date).getTime() >= startTime)
          .reduce((sum, day) => sum + day.pnl, 0);
      };

      const getTrades = (wallet: typeof wallets[0]) => {
        return wallet.historicalPnL
          .filter(day => new Date(day.date).getTime() >= startTime)
          .reduce((sum, day) => sum + day.trades, 0);
      };

      const getWinRate = (wallet: typeof wallets[0]) => {
        const trades = wallet.trades.filter(trade => trade.timestamp >= startTime);
        if (trades.length === 0) return 0;
        return (trades.filter(trade => (trade.pnl || 0) > 0).length / trades.length) * 100;
      };

      switch (sortBy) {
        case 'pnl':
          return getPnL(b) - getPnL(a);
        case 'trades':
          return getTrades(b) - getTrades(a);
        case 'winRate':
          return getWinRate(b) - getWinRate(a);
        default:
          return getPnL(b) - getPnL(a);
      }
    });
  }, [wallets, timeRange, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="mac-title text-lg">Top Performers</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex space-x-1">
            {[
              { key: 'daily', label: '24H' },
              { key: 'weekly', label: '7D' },
              { key: 'monthly', label: '30D' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key as TimeRange)}
                className={`mac-button ${timeRange === key ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`mac-button ${showFilters ? 'active' : ''}`}
          >
            <Filter size={14} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mac-panel p-4 flex gap-4">
          <button
            onClick={() => setSortBy('pnl')}
            className={`mac-button flex-1 justify-center ${sortBy === 'pnl' ? 'active' : ''}`}
          >
            <TrendingUp size={14} />
            <span>P/L</span>
          </button>
          <button
            onClick={() => setSortBy('trades')}
            className={`mac-button flex-1 justify-center ${sortBy === 'trades' ? 'active' : ''}`}
          >
            <Clock size={14} />
            <span>Trade Volume</span>
          </button>
          <button
            onClick={() => setSortBy('winRate')}
            className={`mac-button flex-1 justify-center ${sortBy === 'winRate' ? 'active' : ''}`}
          >
            <Trophy size={14} />
            <span>Win Rate</span>
          </button>
        </div>
      )}

      <div className="space-y-4">
        {sortedWallets.map((wallet, index) => {
          const pnl = wallet.historicalPnL
            .slice(-timeRange === 'daily' ? 1 : timeRange === 'weekly' ? 7 : 30)
            .reduce((sum, day) => sum + day.pnl, 0);

          const winRate = ((wallet.trades.filter(t => (t.pnl || 0) > 0).length / wallet.trades.length) * 100);
          const lastTrade = wallet.trades[0]?.timestamp || Date.now();

          return (
            <div key={wallet.address} className="mac-panel p-4 mac-slide-in">
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[var(--mac-metal)] border border-[var(--mac-border)] flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <img 
                    src={wallet.avatar} 
                    alt={wallet.name}
                    className="w-16 h-16 rounded-full ring-2 ring-[var(--mac-border)]"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="mac-title">{wallet.name}</h3>
                        <a
                          href={`https://solscan.io/account/${wallet.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--mac-text-secondary)] hover:text-[var(--mac-highlight)]"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <p className="text-xs text-[var(--mac-text-secondary)]">{wallet.description}</p>
                    </div>
                    <div className={`text-lg font-mono font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pnl >= 0 ? <ArrowUp size={16} className="inline mr-1" /> : <ArrowDown size={16} className="inline mr-1" />}
                      ${Math.abs(pnl).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mac-panel p-3">
                      <div className="text-xs text-[var(--mac-text-secondary)] mb-1">Win Rate</div>
                      <div className="font-mono font-bold">{winRate.toFixed(1)}%</div>
                    </div>
                    <div className="mac-panel p-3">
                      <div className="text-xs text-[var(--mac-text-secondary)] mb-1">Last Trade</div>
                      <div className="font-mono text-xs">
                        {formatDistanceToNow(lastTrade, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};