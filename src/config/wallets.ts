import { KOLWallet } from '../types';

export const TRACKED_WALLETS: KOLWallet[] = [
  {
    address: "7ABz8qEFZTHPkovMDsmQkm64DZWN5wRtU7LEtD2ShkQ6",
    name: "Red",
    description: "DeFi & NFT Trader",
    twitter: "https://x.com/redwithbag",
    telegram: "https://t.me/yvlred",
    avatar: "https://unavatar.io/twitter/redwithbag",
    tags: ["DeFi", "NFT"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "4wwHh4fzdVTZjmhGHfQUBFasJ3TdQJHNmkfMBwzXEmYL",
    name: "Geni",
    description: "Solana DeFi Expert",
    twitter: "https://x.com/Geni100x",
    avatar: "https://unavatar.io/twitter/Geni100x",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "525LueqAyZJueCoiisfWy6nyh4MTvmF4X9jSqi6efXJT",
    name: "Joji",
    description: "Metaverse & Gaming Trader",
    twitter: "https://x.com/metaversejoji",
    telegram: "https://t.me/jojiinnercircle",
    avatar: "https://unavatar.io/twitter/metaversejoji",
    tags: ["Gaming", "Metaverse"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "4F2AHuw55m9ojKpFfsofmhAwB979ECVRFVurEam4phqU",
    name: "Lunix",
    description: "Solana Trading Expert",
    twitter: "https://x.com/SolLunix",
    telegram: "https://t.me/lunixgambles",
    avatar: "https://unavatar.io/twitter/SolLunix",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "HtucFepgUkMpHdrYsxMqjBNN6qVBdjmFaLZneNXopuJm",
    name: "Frostyjays",
    description: "Solana Trader",
    twitter: "https://x.com/FrostyJayss",
    avatar: "https://unavatar.io/twitter/FrostyJayss",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5",
    name: "Daumen",
    description: "Solana Trader",
    twitter: "https://x.com/daumeneth",
    avatar: "https://unavatar.io/twitter/daumeneth",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "ApRnQN2HkbCn7W2WWiT2FEKvuKJp9LugRyAE1a9Hdz1",
    name: "S",
    description: "Solana Trader",
    twitter: "https://x.com/runitbackghost",
    avatar: "https://unavatar.io/twitter/runitbackghost",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  },
  {
    address: "8rvAsDKeAcEjEkiZMug9k8v1y8mW6gQQiMobd89Uy7qR",
    name: "Casino",
    description: "Solana Trader",
    twitter: "https://x.com/casino616",
    telegram: "https://t.me/casino_calls",
    avatar: "https://unavatar.io/twitter/casino616",
    tags: ["DeFi"],
    holdings: [],
    trades: [],
    activities: [],
    historicalPnL: []
  }
];

// Group wallets by category for easier filtering
export const WALLET_CATEGORIES = {
  DeFi: TRACKED_WALLETS.filter(w => w.tags.includes('DeFi')),
  NFT: TRACKED_WALLETS.filter(w => w.tags.includes('NFT')),
  Gaming: TRACKED_WALLETS.filter(w => w.tags.includes('Gaming')),
  Metaverse: TRACKED_WALLETS.filter(w => w.tags.includes('Metaverse'))
};