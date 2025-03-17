import React, { useState, useMemo } from 'react';
import { X, Twitter, MessageCircle, ExternalLink, TrendingUp, Wallet, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { KOLWallet } from '../types';

interface TraderProfileModalProps {
  wallet: KOLWallet;
  solPrice: number;
  onClose: () => void;
}

type TimeRange = '24h' | '3d' | '7d' | '14d' | '30d';

export const TraderProfileModal: React.FC<TraderProfileModalProps> = ({ wallet, solPrice, onClose }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const getTimeRangeInHours = (range: TimeRange) => {
    switch (range) {
      case '24h': return 24;
      case '3d': return 72;
      case '7d': return 168;
      case '14d': return 336;
      case '30d': return 720;
    }
  };

  const filteredTrades = useMemo(() => {
    const hours = getTimeRangeInHours(timeRange);
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return wallet.trades.filter(trade => trade.timestamp >= cutoff);
  }, [wallet.trades, timeRange]);

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + (trade.price * trade.amount || 0), 0);
  const totalTrades = filteredTrades.length;
  const winRate = totalTrades ? (filteredTrades.filter(trade => (trade.price * trade.amount || 0) > 0).length / totalTrades * 100) : 0;

  const totalSol = wallet.holdings.reduce((sum, holding) => holding.name === 'So11111111111111111111111111111111111111112' ? sum + holding.amount : sum, 0);
  const netWorthUSD = totalSol * solPrice + wallet.holdings.reduce((sum, holding) => sum + (holding.value || 0), 0);

  const pnlData = useMemo(() => {
    const hours = getTimeRangeInHours(timeRange);
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return wallet.historicalPnL.filter(day => new Date(day.date).getTime() >= cutoff);
  }, [wallet.historicalPnL, timeRange]);

  const chartDomain = useMemo(() => {
    const minPnL = Math.min(...pnlData.map(d => d.cumulative || 0));
    const maxPnL = Math.max(...pnlData.map(d => d.cumulative || 0));
    return [minPnL < 0 ? minPnL * 1.1 : 0, maxPnL * 1.1];
  }, [pnlData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-[70px]" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div className="mac-panel p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src={wallet.avatar} alt={wallet.name} className="w-16 h-16 rounded-full ring-2 ring-[var(--mac-border)]" />
              <div>
                <h2 className="text-xl font-bold mb-1">{wallet.name}</h2>
                <p className="text-sm text-[var(--mac-text-secondary)]">{wallet.description}</p>
                <div className="flex space-x-3 mt-2">
                  <a href="https://gmgn.ai/?ref=AFSXmPrX&chain=sol" target="_blank" rel="noopener noreferrer" className="mac-button green flex items-center space-x-2">
                    <Copy size={14} />
                    <span>Copy Trade</span>
                  </a>
                  {wallet.twitter && (
                    <a href={wallet.twitter} target="_blank" rel="noopener noreferrer" className="mac-button">
                      <Twitter size={14} />
                      <span>Twitter</span>
                    </a>
                  )}
                  {wallet.telegram && (
                    <a href={wallet.telegram} target="_blank" rel="noopener noreferrer" className="mac-button">
                      <MessageCircle size={14} />
                      <span>Telegram</span>
                    </a>
                  )}
                  <a href={`https://solscan.io/account/${wallet.address}`} target="_blank" rel="noopener noreferrer" className="mac-button">
                    <ExternalLink size={14} />
                    <span>Solscan</span>
                  </a>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="mac-button"><X size={14} /></button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center">
                <TrendingUp size={14} className="mr-2 text-[var(--mac-highlight)]" />
                Profit/Loss
              </h3>
              <div className="flex space-x-2">
                {(['24h', '3d', '7d', '14d', '30d'] as TimeRange[]).map((range) => (
                  <button key={range} onClick={() => setTimeRange(range)} className={`mac-button ${timeRange === range ? 'active' : ''}`}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="mac-panel p-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pnlData}>
                    <defs>
                      <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--mac-highlight)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--mac-highlight)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--mac-text-secondary)" />
                    <YAxis domain={chartDomain} tick={{ fontSize: 12 }} stroke="var(--mac-text-secondary)" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip contentStyle={{ background: 'var(--mac-window-bg)', border: '1px solid var(--mac-border)', borderRadius: '4px', fontSize: '12px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']} />
                    <Area type="monotone" dataKey="cumulative" stroke="var(--mac-highlight)" fill="url(#pnlGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="mac-panel p-4">
              <div className="text-sm text-[var(--mac-text-secondary)] mb-1">Net Worth</div>
              <div className="flex items-center space-x-2">
                <Wallet size={16} className="text-[var(--mac-highlight)]" />
                <div>
                  <div className="font-mono font-bold">${netWorthUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-[var(--mac-text-secondary)]">{totalSol.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL</div>
                </div>
              </div>
            </div>
            <div className="mac-panel p-4">
              <div className="text-sm text-[var(--mac-text-secondary)] mb-1">PnL ({timeRange})</div>
              <div className={`font-mono font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mac-panel p-4">
              <div className="text-sm text-[var(--mac-text-secondary)] mb-1">Trades</div>
              <div className="font-mono font-bold">{totalTrades}</div>
            </div>
            <div className="mac-panel p-4">
              <div className="text-sm text-[var(--mac-text-secondary)] mb-1">Win Rate</div>
              <div className="font-mono font-bold">{winRate.toFixed(1)}%</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Current Holdings</h3>
            <div className="grid grid-cols-2 gap-4">
              {wallet.holdings.map((holding) => (
                <div key={holding.name} className="mac-panel p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={holding.icon} alt={holding.symbol} className="w-6 h-6" onError={(e) => e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/128/6318/6318574.png'} />
                      <div>
                        <div className="font-medium">{holding.name.slice(0, 10)}</div>
                        <div className="text-xs text-[var(--mac-text-secondary)]">{holding.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{holding.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <div className={`text-xs ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${holding.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Recent Trades</h3>
            <div className="mac-panel overflow-hidden">
              <table className="mac-table w-full">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade, index) => (
                    <tr key={`${trade.txHash}-${index}`}>
                      <td>
                        <div className="flex items-center space-x-2">
                          <img src={trade.tokenIcon} alt={trade.token} className="w-4 h-4" onError={(e) => e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/128/6318/6318574.png'} />
                          <span>{trade.token.slice(0, 10)}</span>
                        </div>
                      </td>
                      <td className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>{trade.type.toUpperCase()}</td>
                      <td>{trade.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td>${trade.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="text-[var(--mac-text-secondary)]">{formatDistanceToNow(trade.timestamp, { addSuffix: true })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};