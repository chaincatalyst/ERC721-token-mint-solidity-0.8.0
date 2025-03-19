const { TRACKED_WALLETS } = require('../constants/wallets');
const { fetchWalletTransactions, fetchWalletTokens, fetchTokenPrice, fetchSPLMetadata } = require('./apis');
const userSchema = require("../models/user.model");

const fetchUserData = async () => {
    // Fetch data for all wallets in parallel
    for (const wallet of TRACKED_WALLETS) {
        let user = await userSchema.findOne({ address:wallet.address });
        if (!user) {
            user = new userSchema({
                address: wallet.address,
                name: wallet.name,
                description: wallet.description,
                twitter: wallet.twitter,
                telegram: wallet.telegram,
                avatar: wallet.avatar,
                tags: wallet.tags,
                trades: wallet.trades,
                activities: wallet.activities,
                historicalPnL: wallet.historicalPnL
            });
            await user.save();
        }
        await userSchema.updateOne({ address: wallet.address }, { $set: { trades: [] } });
        await fetchWalletData(wallet.address);
    }
}

const fetchWalletData = async (address) => {
    try {
        // Fetch wallet transactions and token balances in parallel
        const [transactionsResponse, tokensResponse] = await Promise.all([
            fetchWalletTransactions(address),
            fetchWalletTokens(address)
        ]);
        // Process transactions to get trades
        const trades = await processTransactions(address, transactionsResponse);
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
}


// Helper functions for processing API responses
const processTransactions = async (address, transactions) => {
    if (!transactions) return [];
  
    const filteredTransactions = transactions.filter(tx => tx.type === 'SWAP' && tx.description);
    let trades = [];
    await Promise.all(
        filteredTransactions.map(async (tx) => {
            const description = tx.description;
            let tokenAAddress, tokenBAddress;
            let tokenAIcon = 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png', tokenBIcon = 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png';
            
            const amountA = description.split(' ')[2];
            let tokenA = description.split(' ')[3];

            const amountB = description.split(' ')[5];
            let tokenB = description.split(' ')[6];

            if (tokenA != 'SOL') {
                const metadata = await fetchSPLMetadata(tokenA);
                tokenAAddress = tokenA;
                tokenA = metadata?.result?.content?.metadata?.symbol;
                tokenAIcon = metadata?.result?.content?.links?.image;
            } else {
                tokenAAddress = 'So11111111111111111111111111111111111111112';
                tokenAIcon = 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png';
            }

            if (tokenB != 'SOL') {
                const metadata = await fetchSPLMetadata(tokenB);
                tokenBAddress = tokenB;
                tokenB = metadata?.result?.content?.metadata?.symbol;
                tokenBIcon = metadata?.result?.content?.links?.image;
            } else {
                tokenBAddress = 'So11111111111111111111111111111111111111112';
                tokenBIcon = 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png';
            }

            const priceAData = await fetchTokenPrice(tokenAAddress);
            const priceBData = await fetchTokenPrice(tokenBAddress);
            if (((amountA * priceAData[0]?.priceUsd) > 100) || ((amountB * priceBData[0]?.priceUsd) > 100)) {
                trades.push({
                    timestamp: tx.timestamp * 1000,
                    type: 'SELL',
                    token: tokenA || 'Unknown',
                    tokenAddress: tokenAAddress || 'Unknown',
                    tokenIcon: tokenAIcon || 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png',
                    amount: amountA || 0,
                    price: priceAData[0]?.priceUsd || 0,
                    pnl: 0,
                    txHash: tx.signature
                });
                trades.push({
                    timestamp: tx.timestamp * 1000,
                    type: "BUY",
                    token: tokenB || 'Unknown',
                    tokenAddress: tokenBAddress || 'Unknown',
                    tokenIcon: tokenBIcon || 'https://cdn-icons-png.flaticon.com/128/12114/12114239.png',
                    amount: amountB || 0,
                    price: priceBData[0]?.priceUsd || 0,
                    pnl: 0,
                    txHash: tx.signature
                })
            }
        })
    );

    await userSchema.updateOne({ address }, { $set: { trades } });

    return trades;
  }
  
module.exports = { fetchUserData };