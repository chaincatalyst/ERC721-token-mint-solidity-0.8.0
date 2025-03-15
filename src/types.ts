export interface KOLWallet {
  address: string;
  name: string;
  description?: string;
  twitter?: string;
  telegram?: string;
  avatar?: string;
  tags: string[];
  holdings: TokenHolding[];
  trades: Trade[];
  activities: WalletActivity[];
  historicalPnL: PnLData[];
  lastUpdated?: number;
}

export interface TokenHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  icon: string;
}

export interface Trade {
  timestamp: number;
  type: 'buy' | 'sell' | 'transfer';
  token: string;
  tokenIcon: string;
  amount: number;
  price: number;
  pnl?: number;
  txHash: string;
}

export interface WalletActivity {
  timestamp: number;
  type: 'swap' | 'transfer';
  tokenIn?: string;
  tokenOut?: string;
  amount: number;
  txHash: string;
}

export interface PnLData {
  date: string;
  pnl: number;
  cumulative: number;
  trades: number;
}