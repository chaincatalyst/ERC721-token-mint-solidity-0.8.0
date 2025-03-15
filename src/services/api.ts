import { API_KEYS, API_ENDPOINTS } from '../config/api';

// Token-related endpoints
export const fetchTokenPrice = async (tokenAddress: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/price?address=${tokenAddress}`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

export const fetchTokenMetadata = async (tokenAddress: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/v3/token/meta-data/single?address=${tokenAddress}`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};

export const fetchTokenVolume = async (tokenAddress: string, timeRange: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/price_volume/single?address=${tokenAddress}&time_range=${timeRange}`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching token volume:', error);
    throw error;
  }
};

// Market data endpoints
export const fetchTrendingTokens = async () => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
};

export const fetchTokenPriceHistory = async (tokenAddress: string, type: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/history_price?address=${tokenAddress}&address_type=token&type=${type}`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price history:', error);
    throw error;
  }
};

// Wallet-related endpoints
export const fetchWalletTransactions = async (walletAddress: string) => {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions/?api-key=6e608376-f6fc-4234-b275-f70dbd272e5e`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    throw error;
  }
};

export const fetchWalletTokens = async (walletAddress: string) => {
  try {
    console.log(walletAddress)
    const response = await fetch(API_ENDPOINTS.HELIUS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: 'getTokenAccountsByOwner',
        params: [walletAddress, {
          "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "encoding": "jsonParsed"
        }]
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    throw error;
  }
};

// Market overview endpoints
export const fetchMarketOverview = async (tokenAddress: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BIRDEYE}/defi/v3/token/market-data?address=${tokenAddress}`, {
      headers: {
        'X-API-KEY': API_KEYS.BIRDEYE_API_KEY
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching market overview:', error);
    throw error;
  }
};