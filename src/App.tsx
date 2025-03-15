import React, { useEffect } from 'react';
import { NotificationPanel } from './components/NotificationPanel';
import { Leaderboard } from './components/Leaderboard';
import { SettingsPanel } from './components/SettingsPanel';
import { TradesGrid } from './components/TradesGrid';
import { SearchOverlay } from './components/SearchOverlay';
import { TrendingTrades } from './components/TrendingTrades';
import { useWalletStore } from './store/walletStore';
import { LineChart, Search, Settings, Twitter, Wallet, Trophy, Star, Bell, TrendingUp, Sun, Moon, Mail, MessageCircle } from 'lucide-react';

type View = 'trades' | 'trending' | 'leaderboards' | 'notifications' | 'settings';

const FALLBACK_SOL_PRICE = 150;
const PRICE_REFRESH_INTERVAL = 60000;

function App() {
  const { 
    wallets, 
    theme, 
    setTheme, 
    initializeWallets 
  } = useWalletStore();

  const [currentView, setCurrentView] = React.useState<View>('trades');
  const [showSettings, setShowSettings] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [solPrice, setSolPrice] = React.useState<number>(FALLBACK_SOL_PRICE);
  const [priceChange, setPriceChange] = React.useState<number>(0);
  const [lastUpdated, setLastUpdated] = React.useState<number>(Date.now());

  const fetchSolPrice = React.useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true',
        { signal: controller.signal, mode: 'no-cors' }
      );
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data?.solana?.usd) {
        setSolPrice(data.solana.usd);
        setPriceChange(data.solana.usd_24h_change || 0);
        setLastUpdated(Date.now());
      }
    } catch (error) {
      console.warn('Error fetching SOL price:', error);
      if (Date.now() - lastUpdated > 300000) {
        setSolPrice(FALLBACK_SOL_PRICE);
        setPriceChange(0);
      }
    }
  }, [lastUpdated]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, PRICE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSolPrice]);

  useEffect(() => {
    // Initialize wallet data when the app loads
    initializeWallets();
  }, [initializeWallets]);

  const handleSolPriceClick = () => window.open('https://www.tradingview.com/chart/?symbol=SOLUSD', '_blank');

  return (
    <div className="min-h-screen p-6">
      <div className={`max-w-7xl mx-auto mac-window relative ${showSettings ? 'blur-[2px] pointer-events-none' : ''}`}>
        <div className="mac-toolbar flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowSettings(!showSettings)} className={`mac-button ${showSettings ? 'active' : ''}`}>
              <Settings size={14} />
            </button>
            <div className="w-10 h-10 bg-[var(--mac-highlight)] rounded-full flex items-center justify-center">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <h1 className="mac-title">ChainSpy</h1>
            <button onClick={handleSolPriceClick} className="text-xs flex items-center space-x-1.5 bg-[var(--mac-window-bg)] rounded-lg px-2 py-1 hover:brightness-110 transition-all">
              <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="SOL" className="w-3.5 h-3.5" />
              <span className="font-mono font-medium">${solPrice.toFixed(2)}</span>
              <span className={`${priceChange >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                <TrendingUp size={10} className="mr-0.5" />
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="mac-button">
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button onClick={() => setShowSearch(true)} className="mac-button">
                <Search size={14} />
              </button>
            </div>
            <button className="mac-button purple flex items-center space-x-2">
              <Star size={12} />
              <span>Upgrade to Premium</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mac-nav mb-6">
            {[
              { view: 'trades', icon: Wallet, label: 'Trades', color: 'green' },
              { view: 'trending', icon: TrendingUp, label: 'Trending', color: 'orange' },
              { view: 'leaderboards', icon: Trophy, label: 'Leaderboards', color: 'purple' },
              { view: 'notifications', icon: Bell, label: 'Notifications', color: 'red' }
            ].map(({ view, icon: Icon, label, color }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as View)}
                className={`mac-button ${currentView === view ? color : ''} ${currentView === view ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {currentView === 'leaderboards' && <Leaderboard />}
            {currentView === 'notifications' && <NotificationPanel />}
            {currentView === 'trades' && <TradesGrid wallets={wallets} solPrice={solPrice} />}
            {currentView === 'trending' && <TrendingTrades />}
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--mac-border)] flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com/chainspy" target="_blank" rel="noopener noreferrer" className="mac-button flex items-center space-x-1">
                <Twitter size={12} />
                <span>Follow us</span>
              </a>
              <a href="mailto:contact@chainspy.com" className="mac-button flex items-center space-x-1">
                <Mail size={12} />
                <span>Contact</span>
              </a>
              <a href="https://t.me/chainspy" target="_blank" rel="noopener noreferrer" className="mac-button flex items-center space-x-1">
                <MessageCircle size={12} />
                <span>Join Telegram</span>
              </a>
            </div>
            <div className="text-[var(--mac-text-secondary)]">© 2024 ChainSpy</div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-[70px]" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-2xl">
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}

export default App;