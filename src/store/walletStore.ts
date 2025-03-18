import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Connection } from '@solana/web3.js';
import type { KOLWallet, NotificationSettings, SortOption } from '../types';
import { fetchWalletTransactions, fetchWalletTokens, fetchTokenPrice } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { TRACKED_WALLETS } from '../config/wallets';
import { fetchSPLMetadata } from '../services/api';

export const useWalletStore = create<{
  wallets: KOLWallet[];
  selectedWallets: string[];
  sortOption: SortOption;
  timeRange: number;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  defaultPlatform: string;
  notificationSettings: NotificationSettings;
  connection: Connection;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  addWallet: (wallet: KOLWallet) => void;
  removeWallet: (address: string) => void;
  toggleWalletSelection: (address: string) => void;
  setSelectedWallets: (addresses: string[]) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  setConnection: (connection: Connection) => void;
  setSortOption: (option: SortOption) => void;
  setTimeRange: (days: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setDefaultPlatform: (platform: string) => void;
  fetchWalletData: (address: string) => Promise<void>;
  initializeWallets: () => Promise<void>;
}>()(
  persist(
    (set, get) => ({
      // Initialize with tracked wallets
      wallets: TRACKED_WALLETS,
      selectedWallets: TRACKED_WALLETS.map(w => w.address),
      sortOption: 'recent',
      timeRange: 30,
      theme: 'dark',
      soundEnabled: true,
      defaultPlatform: 'DexScreener',
      notificationSettings: {
        enabled: false,
        minAmount: 1000,
        walletAddresses: TRACKED_WALLETS.map(w => w.address),
      },
      connection: new Connection(API_ENDPOINTS.QUICKNODE),
      loading: Object.fromEntries(TRACKED_WALLETS.map(w => [w.address, false])),
      errors: Object.fromEntries(TRACKED_WALLETS.map(w => [w.address, ''])),

      addWallet: (wallet) => {
        set((state) => ({
          wallets: [...state.wallets, wallet],
          selectedWallets: [...state.selectedWallets, wallet.address],
        }));
      },

      removeWallet: (address) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w.address !== address),
          selectedWallets: state.selectedWallets.filter((a) => a !== address),
        })),

      toggleWalletSelection: (address) =>
        set((state) => ({
          selectedWallets: state.selectedWallets.includes(address)
            ? state.selectedWallets.filter((a) => a !== address)
            : [...state.selectedWallets, address],
        })),

      setSelectedWallets: (addresses) => set({ selectedWallets: addresses }),
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),
      setConnection: (connection) => set({ connection }),
      setSortOption: (option) => set({ sortOption: option }),
      setTimeRange: (days) => set({ timeRange: days }),
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setDefaultPlatform: (platform) => set({ defaultPlatform: platform }),

      fetchWalletData: async (address: string) => {
        set((state) => ({ 
          loading: { ...state.loading, [address]: true },
          errors: { ...state.errors, [address]: '' }
        }));

        try {
          // Fetch wallet transactions and token balances in parallel
          const [transactionsResponse, tokensResponse] = await Promise.all([
            fetchWalletTransactions(address),
            fetchWalletTokens(address)
          ]);

          // Process transactions to get trades
          console.log('transactionsResponse', transactionsResponse);
          const trades = await processTransactions(transactionsResponse);
          console.log('trades', trades);
          // Process token balances to get holdings
          const holdings = await processTokenBalances(tokensResponse.result?.value);

          // Update wallet data
          set((state) => ({
            wallets: state.wallets.map((wallet) =>
              wallet.address === address
                ? {
                    ...wallet,
                    trades,
                    holdings,
                    lastUpdated: Date.now(),
                  }
                : wallet
            ),
            loading: { ...state.loading, [address]: false },
          }));
        } catch (error) {
          console.error('Error fetching wallet data:', error);
          set((state) => ({
            loading: { ...state.loading, [address]: false },
            errors: { ...state.errors, [address]: 'Failed to fetch wallet data' },
          }));
        }
      },

      initializeWallets: async () => {
        const { wallets } = get();
        
        // Fetch data for all wallets in parallel
        for (const wallet of wallets) {
          await get().fetchWalletData(wallet.address)
        }
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        selectedWallets: state.selectedWallets,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        defaultPlatform: state.defaultPlatform,
      }),
    }
  )
);

// Helper functions for processing API responses
async function processTransactions(transactions: any[]) {
  if (!transactions) return [];

  const filteredTransactions = transactions.filter(tx => (tx.type === 'SWAP' || tx.type === 'TRANSFER') && tx.description);
  const results = await Promise.all(
    filteredTransactions.slice(0, 2).map(async (tx) => {
      const description = tx.description;
      let token, amount, tokenIcon = 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png';
      if (tx.type == 'TRANSFER') {
        if (description.includes('a total')) {
          token = description.split(' ')[5];
          amount = description.split(' ')[4];
        } else {
          token = description.split(' ')[3];
          amount = description.split(' ')[2];
        }
      } else if (tx.type == 'SWAP') {
        token = description.split(' ')[description.split(' ').length - 1];
        amount = description.split(' ')[description.split(' ').length - 2];
      }
      if (token != 'SOL') {
        const metadata = await fetchSPLMetadata(token);
        token = metadata?.result?.content?.metadata?.symbol;
        tokenIcon = metadata?.result?.content?.links?.image;
      }
      return {
        timestamp: tx.timestamp * 1000,
        type: tx.type,
        token: token || 'Unknown',
        tokenIcon: tokenIcon || 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png',
        amount: amount || 0,
        price: 0,
        pnl: 0,
        txHash: tx.signature
      }
    })
  );
  return results;
}

async function processTokenBalances(balances: any[]) {
  if (!balances) return [];
  
  const holdings = [];
  
  for (const balance of balances) {
    try {
      const priceData = await fetchTokenPrice(balance?.account?.data?.parsed?.info?.mint);
      console.log("priceData", priceData)
      const metadata = await fetchSPLMetadata(balance?.account?.data?.parsed?.info?.mint);
      
      holdings.push({
        symbol: metadata?.result?.content?.metadata?.symbol || 'Unknown',
        name: metadata?.result?.content?.metadata?.name || 'Unknown Token',
        amount: balance?.account?.data?.parsed?.info?.tokenAmount?.amount || 0,
        value: (balance?.account?.data?.parsed?.info?.tokenAmount?.amount || 0) * (priceData?.priceUsd || 0),
        change24h: priceData?.priceChange?.h24 || 0,
        icon: metadata?.result?.content?.links?.image || 'https://cdn-icons-png.flaticon.com/128/6318/6318574.png'
      });
    } catch (error) {
      console.error('Error processing token balance:', error);
    }
  }
  
  return holdings;
}