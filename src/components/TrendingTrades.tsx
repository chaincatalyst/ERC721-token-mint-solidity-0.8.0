import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, ExternalLink, Info, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useWalletStore } from '../store/walletStore';

type TimeRange = '1h' | '4h' | '24h' | '7d';

interface TokenData {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange: number;
  volumeChange: number;
  trades: number;
  lastTrade: number;
}

export const TrendingTrades: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('4h');

  // Mock data generator based on time range
  const generateTokenData = (timeRange: TimeRange): TokenData[] => {
    const baseTokens = [
      {
        symbol: "PEPE",
        name: "Pepe Solana",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
        basePrice: 0.000001,
        baseMarketCap: 75000,
        baseVolume: 15000,
      },
      {
        symbol: "RENDER",
        name: "Render Token",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/RENDERpc5t9kN5pS4iF3VLMjHqTuYxVnwqEL8e1NZ6R/logo.png",
        basePrice: 0.05,
        baseMarketCap: 450000,
        baseVolume: 120000,
      },
      {
        symbol: "JTO",
        name: "Jito",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JitoNz6j45zvPkyCyKAHcwfFgHaYqYYZReGqS1kqkAX/logo.png",
        basePrice: 2.15,
        baseMarketCap: 2150000,
        baseVolume: 850000,
      },
      {
        symbol: "PYTH",
        name: "Pyth Network",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png",
        basePrice: 1.85,
        baseMarketCap: 1850000,
        baseVolume: 750000,
      },
      {
        symbol: "HADES",
        name: "Hades",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BWXrrYFhT7bMHmNBFoQFWdsSgA3yXoXkHoQHBvdwcVE1/logo.png",
        basePrice: 0.08,
        baseMarketCap: 750000,
        baseVolume: 250000,
      }
    ];

    // Volatility multiplier based on time range
    const getVolatility = (range: TimeRange) => {
      switch (range) {
        case '1h': return 0.5;
        case '4h': return 1;
        case '24h': return 2;
        case '7d': return 3;
        default: return 1;
      }
    };

    const volatility = getVolatility(timeRange);

    return baseTokens.map(token => {
      // Generate more volatile changes for longer time periods
      const priceChange = (Math.random() * 30 - 15) * volatility;
      const volumeChange = (Math.random() * 40 - 20) * volatility;
      
      // Calculate current price based on price change
      const currentPrice = token.basePrice * (1 + priceChange / 100);
      
      // Calculate current volume based on volume change
      const currentVolume = token.baseVolume * (1 + volumeChange / 100);
      
      // Generate trades count based on time range
      const tradesMultiplier = {
        '1h': 1,
        '4h': 4,
        '24h': 24,
        '7d': 168
      }[timeRange];
      
      return {
        symbol: token.symbol,
        name: token.name,
        icon: token.icon,
        price: currentPrice,
        marketCap: token.baseMarketCap * (1 + priceChange / 100),
        volume24h: currentVolume,
        priceChange,
        volumeChange,
        trades: Math.floor(Math.random() * 50 * tradesMultiplier),
        lastTrade: Date.now() - Math.floor(Math.random() * 3600000) // Random time within last hour
      };
    });
  };

  const tokens = useMemo(() => generateTokenData(timeRange), [timeRange]);

  const categorizedTokens = useMemo(() => {
    const sortedTokens = [...tokens].sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
    return {
      lowCaps: sortedTokens.filter(token => token.marketCap < 100000),
      midCaps: sortedTokens.filter(token => token.marketCap >= 100000 && token.marketCap < 900000),
      highCaps: sortedTokens.filter(token => token.marketCap >= 900000)
    };
  }, [tokens]);

  const TokenCard: React.FC<{ token: TokenData }> = ({ token }) => (
    <div className="mac-panel p-4 hover:brightness-105 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={token.icon} 
            alt={token.symbol} 
            className="w-8 h-8 rounded-full"
            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/32'} 
          />
          <div>
            <h3 className="font-medium">{token.symbol}</h3>
            <p className="text-xs text-[var(--mac-text-secondary)]">{token.name}</p>
          </div>
        </div>
        <a
          href={`https://birdeye.so/token/${token.symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button"
        >
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="mac-panel bg-[var(--mac-window-bg)] p-2">
          <div className="text-xs text-[var(--mac-text-secondary)] mb-1">Price</div>
          <div className="font-mono font-medium">
            ${token.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
        </div>
        <div className="mac-panel bg-[var(--mac-window-bg)] p-2">
          <div className="text-xs text-[var(--mac-text-secondary)] mb-1">{timeRange}</div>
          <div className={`font-mono font-medium flex items-center ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.priceChange >= 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
            {Math.abs(token.priceChange).toFixed(1)}%
          </div>
        </div>
        <div className="mac-panel bg-[var(--mac-window-bg)] p-2">
          <div className="text-xs text-[var(--mac-text-secondary)] mb-1">Volume</div>
          <div className="font-mono font-medium">${token.volume24h.toLocaleString()}</div>
        </div>
        <div className="mac-panel bg-[var(--mac-window-bg)] p-2">
          <div className="text-xs text-[var(--mac-text-secondary)] mb-1">Trades</div>
          <div className="font-mono font-medium">{token.trades}</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-[var(--mac-text-secondary)] flex items-center">
        <Clock size={12} className="mr-1" />
        Last trade {formatDistanceToNow(token.lastTrade, { addSuffix: true })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[var(--mac-highlight)]" />
          <h2 className="mac-title text-lg">Trending Trades</h2>
          <div className="relative group">
            <Info size={14} className="text-[var(--mac-text-secondary)]" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--mac-window-bg)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs">
              Trading activity updated in real-time
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {[
            { key: '1h', label: '1H' },
            { key: '4h', label: '4H' },
            { key: '24h', label: '24H' },
            { key: '7d', label: '7D' }
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            Low Caps
            <span className="text-xs text-[var(--mac-text-secondary)] ml-2">(&lt; $100k)</span>
          </h3>
          <div className="space-y-4">
            {categorizedTokens.lowCaps.map(token => (
              <TokenCard key={token.symbol} token={token} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            Mid Caps
            <span className="text-xs text-[var(--mac-text-secondary)] ml-2">($100k - $900k)</span>
          </h3>
          <div className="space-y-4">
            {categorizedTokens.midCaps.map(token => (
              <TokenCard key={token.symbol} token={token} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            High Caps
            <span className="text-xs text-[var(--mac-text-secondary)] ml-2">($900k+)</span>
          </h3>
          <div className="space-y-4">
            {categorizedTokens.highCaps.map(token => (
              <TokenCard key={token.symbol} token={token} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};