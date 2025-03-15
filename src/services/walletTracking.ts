import { Connection, PublicKey } from '@solana/web3.js';
import { API_ENDPOINTS, API_KEYS } from '../config/api';
import { KOLWallet, TokenHolding, Trade } from '../types';
import { TRACKED_WALLETS } from '../config/wallets';

export async function fetchWalletData(wallet: KOLWallet) {
  try {
    // Fetch wallet transactions from Helius
    const transactionsResponse = await fetch(API_ENDPOINTS.HELIUS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: 'getAddressHistory',
        params: [wallet.address]
      })
    });
    const transactions = await transactionsResponse.json();

    // Fetch token balances from Helius
    const balancesResponse = await fetch(API_ENDPOINTS.HELIUS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: 'getTokenBalances',
        params: [wallet.address]
      })
    });
    const balances = await balancesResponse.json();

    // Process token balances
    const holdings: TokenHolding[] = [];
    for (const balance of balances.result) {
      try {
        // Get token price and metadata from Birdeye
        const [priceData, metadata] = await Promise.all([
          fetch(`${API_ENDPOINTS.BIRDEYE}/public/price?address=${balance.mint}`, {
            headers: { 'X-API-KEY': API_KEYS.BIRDEYE_API_KEY }
          }).then(res => res.json()),
          fetch(`${API_ENDPOINTS.BIRDEYE}/public/token_metadata?address=${balance.mint}`, {
            headers: { 'X-API-KEY': API_KEYS.BIRDEYE_API_KEY }
          }).then(res => res.json())
        ]);

        holdings.push({
          symbol: metadata.symbol,
          name: metadata.name,
          amount: balance.amount,
          value: balance.amount * priceData.price,
          change24h: priceData.priceChange24h,
          icon: metadata.logoURI
        });
      } catch (error) {
        console.error(`Error processing token ${balance.mint}:`, error);
      }
    }

    // Process transactions into trades
    const trades: Trade[] = transactions.result
      .filter((tx: any) => tx.type === 'SWAP' || tx.type === 'TOKEN_TRANSFER')
      .map((tx: any) => ({
        timestamp: tx.timestamp,
        type: tx.type === 'SWAP' ? (tx.tokenInAmount > tx.tokenOutAmount ? 'sell' : 'buy') : 'transfer',
        token: tx.tokenSymbol,
        tokenIcon: tx.tokenIcon || 'https://via.placeholder.com/24',
        amount: tx.type === 'SWAP' ? tx.tokenInAmount : tx.amount,
        price: tx.type === 'SWAP' ? tx.tokenOutAmount / tx.tokenInAmount : 0,
        pnl: 0, // Calculate P&L by comparing with historical prices
        txHash: tx.signature
      }));

    return {
      holdings,
      trades,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching data for wallet ${wallet.address}:`, error);
    throw error;
  }
}

export async function initializeWalletTracking() {
  try {
    // Initialize connection with Quicknode RPC
    const connection = new Connection(API_ENDPOINTS.QUICKNODE);

    // Subscribe to account changes for all tracked wallets
    const subscriptions = TRACKED_WALLETS.map(wallet => {
      const pubkey = new PublicKey(wallet.address);
      return connection.onAccountChange(pubkey, () => {
        // Trigger wallet data update when account changes
        fetchWalletData(wallet);
      });
    });

    // Initial data fetch for all wallets
    await Promise.all(TRACKED_WALLETS.map(fetchWalletData));

    return subscriptions;
  } catch (error) {
    console.error('Error initializing wallet tracking:', error);
    throw error;
  }
}