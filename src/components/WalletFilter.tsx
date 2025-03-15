import React, { useState, useMemo } from 'react';
import { useWalletStore } from '../store/walletStore';
import { Check, Filter, X } from 'lucide-react';

export const WalletFilter: React.FC = () => {
  const { wallets, selectedWallets, setSelectedWallets } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedWallets);

  const sortedWallets = useMemo(() => 
    [...wallets].sort((a, b) => a.name.localeCompare(b.name)), 
    [wallets]
  );

  const handleToggleAll = () => {
    setTempSelected(tempSelected.length === wallets.length ? [] : wallets.map(w => w.address));
  };

  const handleToggle = (address: string) => {
    setTempSelected(prev => 
      prev.includes(address) 
        ? prev.filter(a => a !== address) 
        : [...prev, address]
    );
  };

  const handleApply = () => {
    setSelectedWallets(tempSelected);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setTempSelected(selectedWallets);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen} 
        className="mac-button flex items-center space-x-2"
      >
        <Filter size={14} />
        <span>Filter Wallets</span>
        {selectedWallets.length !== wallets.length && (
          <span className="bg-[var(--mac-highlight)] text-white text-xs px-1.5 rounded-full">
            {selectedWallets.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 mac-panel p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filter Wallets</h3>
              <button onClick={() => setIsOpen(false)} className="mac-button">
                <X size={14} />
              </button>
            </div>

            <div className="mb-4">
              <button 
                onClick={handleToggleAll} 
                className="mac-button w-full justify-center"
              >
                {tempSelected.length === wallets.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {sortedWallets.map((wallet) => (
                <div
                  key={wallet.address}
                  onClick={() => handleToggle(wallet.address)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--mac-metal)] cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                    tempSelected.includes(wallet.address) 
                      ? 'bg-[var(--mac-highlight)] border-[var(--mac-highlight)]' 
                      : 'border-[var(--mac-border)]'
                  }`}>
                    {tempSelected.includes(wallet.address) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <img 
                    src={wallet.avatar} 
                    alt={wallet.name} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="flex-grow">{wallet.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={() => setIsOpen(false)} 
                className="mac-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply} 
                className="mac-button green"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};