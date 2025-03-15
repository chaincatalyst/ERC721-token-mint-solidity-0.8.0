import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { wallets } = useWalletStore();
  const [results, setResults] = useState<typeof wallets>([]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = wallets.filter(wallet => 
        wallet.name.toLowerCase().includes(query.toLowerCase()) ||
        wallet.address.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, wallets]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-20">
        <div className="bg-[var(--mac-window-bg)] rounded-lg shadow-xl">
          <div className="p-4 border-b border-[var(--mac-border)]">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search wallets by name or address..."
                className="w-full mac-input pl-10 pr-4 py-2"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--mac-text-secondary)]" />
            </div>
          </div>
          
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto p-2">
              {results.map(wallet => (
                <div 
                  key={wallet.address}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--mac-metal)] cursor-pointer"
                >
                  <img 
                    src={wallet.avatar} 
                    alt={wallet.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{wallet.name}</h3>
                    <p className="text-xs text-[var(--mac-text-secondary)]">{wallet.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};