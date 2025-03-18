import { API_KEYS, API_ENDPOINTS } from '../config/api';

// Token-related endpoints
export const fetchTokenPrice = async (tokenAddress: string) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

// Wallet-related endpoints
export const fetchWalletTransactions = async (walletAddress: string) => {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions/?api-key=${API_KEYS.HELIUS_API_KEY}`, {
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

export const fetchSPLMetadata = async (tokenAddress: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.HELIUS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: "getAsset",
        params: {
          "id": tokenAddress
        }
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}
