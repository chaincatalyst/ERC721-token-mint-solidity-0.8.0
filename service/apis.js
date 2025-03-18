require("dotenv").config();

// Token-related endpoints
const fetchTokenPrice = async (tokenAddress) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
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
const fetchWalletTransactions = async (walletAddress) => {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions/?api-key=${process.env.HELIUS_API_KEY}`, {
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

const fetchWalletTokens = async (walletAddress) => {
  try {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
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

const fetchSPLMetadata = async (tokenAddress) => {
  try {
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
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

module.exports = { fetchTokenPrice, fetchWalletTransactions, fetchWalletTokens, fetchSPLMetadata };