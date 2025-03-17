import React, { useState, useMemo, Component, ReactNode } from 'react';
import { ExternalLink, TrendingUp, Twitter, MessageCircle, Wallet, ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { KOLWallet } from '../types';
import { TraderProfileModal } from './TraderProfileModal';
import { WalletFilter } from './WalletFilter';
import { useWalletStore } from '../store/walletStore';

// Error Boundary Component
class TradesGridErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error in TradesGrid:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mac-panel p-4 text-red-500 text-center">
          Something went wrong while displaying trades. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

interface TradesGridProps {
  wallets: KOLWallet[];
  solPrice: number;
}

export const TradesGrid: React.FC<TradesGridProps> = ({ wallets, solPrice }) => {
  const [selectedWallet, setSelectedWallet] = useState<KOLWallet | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedWallets, loading, errors } = useWalletStore();
  const walletsPerPage = 12;

  const filteredWallets = useMemo(() => wallets.filter(wallet => selectedWallets.includes(wallet.address)), [wallets, selectedWallets]);
  const totalPages = Math.ceil(filteredWallets.length / walletsPerPage);
  const currentWallets = useMemo(() => {
    const indexOfLastWallet = currentPage * walletsPerPage;
    const indexOfFirstWallet = indexOfLastWallet - walletsPerPage;
    return filteredWallets.slice(indexOfFirstWallet, indexOfLastWallet);
  }, [filteredWallets, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateRecentPnL = (wallet: KOLWallet) => {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentTrades = wallet.trades.filter(trade => trade.timestamp >= last24Hours);
    return recentTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  };

  return (
    <TradesGridErrorBoundary>
      <div className="flex justify-end mb-6">
        <WalletFilter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWallets.map((wallet) => {
          const totalSol = wallet.holdings.reduce((sum, holding) => 
            holding.symbol === 'SOL' ? sum + holding.amount : sum, 0
          );
          const netWorthUSD = totalSol * solPrice;
          const recentPnL = calculateRecentPnL(wallet);
          const isLoading = loading[wallet.address] ?? false;
          const error = errors[wallet.address] ?? '';

          if (isLoading) {
            return (
              <div key={wallet.address} className="mac-panel p-4">
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--mac-highlight)]" />
                </div>
              </div>
            );
          }

          if (error) {
            return (
              <div key={wallet.address} className="mac-panel p-4">
                <div className="text-red-500 text-center">
                  Error: {error}
                </div>
              </div>
            );
          }

          return (
            <div 
              key={wallet.address} 
              className="mac-panel p-4 mac-slide-in cursor-pointer hover:brightness-105 transition-all"
              onClick={() => setSelectedWallet(wallet)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative group">
                  <img 
                    src={wallet.avatar} 
                    alt={wallet.name} 
                    className="w-12 h-12 rounded-full ring-2 ring-[var(--mac-border)] transition-transform group-hover:scale-110" 
                  />
                  {wallet.twitter && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={wallet.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full flex items-center justify-center bg-black/50 rounded-full"
                      >
                        <Twitter size={16} className="text-white" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="mac-title">{wallet.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs bg-[var(--mac-window-bg)] rounded-lg px-2 py-1">
                        <div className="flex items-center space-x-1 text-[var(--mac-text-secondary)]">
                          <Wallet size={10} />
                          <span>{totalSol.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL</span>
                        </div>
                        <div className="font-mono text-[var(--mac-highlight)]">
                          ${netWorthUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <a href={`https://solscan.io/account/${wallet.address}`} target="_blank" rel="noopener noreferrer" className="mac-button" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--mac-text-secondary)] mt-1">{wallet.description}</p>
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                {wallet.twitter && (
                  <a href={wallet.twitter} target="_blank" rel="noopener noreferrer" className="mac-button flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Twitter size={12} />
                    <span>Twitter</span>
                  </a>
                )}
                {wallet.telegram && (
                  <a href={wallet.telegram} target="_blank" rel="noopener noreferrer" className="mac-button flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <MessageCircle size={12} />
                    <span>Telegram</span>
                  </a>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-[var(--mac-text-secondary)] flex items-center">
                    <TrendingUp size={12} className="mr-1" />
                    24h P/L
                  </h4>
                  <div className="relative group">
                    <Info size={12} className="text-[var(--mac-text-secondary)]" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[var(--mac-window-bg)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs">
                      Data delayed by 15 minutes for free tier users. Upgrade to Premium for real-time data.
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--mac-window-bg)] rounded-lg p-3">
                  {wallet.trades.length === 0 ? (
                    <div className="text-center text-sm text-[var(--mac-text-secondary)]">
                      No recent trades
                    </div>
                  ) : recentPnL === 0 ? (
                    <div className="text-center text-sm text-[var(--mac-text-secondary)] animate-pulse">
                      Loading P/L data...
                    </div>
                  ) : (
                    <div className={`font-mono font-bold text-lg ${recentPnL > 0 ? 'text-green-500' : recentPnL < 0 ? 'text-red-500' : 'text-[var(--mac-text-secondary)]'}`}>
                      {recentPnL > 0 ? '+' : ''}{recentPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {wallet.trades.slice(0, 3).map((trade, index) => (
                    <div key={index} className="bg-[var(--mac-window-bg)] rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <img src={trade.tokenIcon} alt={trade.token} className="w-4 h-4" onError={(e) => e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/128/6318/6318574.png'} />
                          <span>{trade.token.slice(0, 10)}</span>
                        </div>
                        <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>{trade.type.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--mac-text-secondary)]">
                        <span>{trade.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        <span>{formatDistanceToNow(trade.timestamp, { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="mac-button">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`mac-button ${currentPage === pageNumber ? 'active' : ''}`}>
              {pageNumber}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="mac-button">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedWallet && <TraderProfileModal wallet={selectedWallet} solPrice={solPrice} onClose={() => setSelectedWallet(null)} />}
    </TradesGridErrorBoundary>
  );
};