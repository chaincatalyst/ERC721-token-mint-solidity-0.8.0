import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';

export const NotificationPanel: React.FC = () => {
  const { notificationSettings, updateNotificationSettings } = useWalletStore();

  return (
    <div className="mac-panel p-4 mac-slide-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell size={14} className="text-[var(--mac-highlight)]" />
          <h2 className="mac-title">Notifications</h2>
        </div>
        <button
          onClick={() => updateNotificationSettings({ enabled: !notificationSettings.enabled })}
          className={`mac-button ${notificationSettings.enabled ? 'active' : ''}`}
        >
          {notificationSettings.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Settings size={12} className="text-[var(--mac-text-secondary)]" />
            <h3 className="mac-title text-sm">Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-xs font-bold text-[var(--mac-text-secondary)]">
                Minimum Amount (SOL)
              </label>
              <input
                type="number"
                value={notificationSettings.minAmount}
                onChange={(e) => updateNotificationSettings({ minAmount: Number(e.target.value) })}
                className="mac-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--mac-text-secondary)]">
                Notification Types
              </label>
              {['Swaps', 'Transfers', 'NFT Activities', 'DeFi'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-[var(--mac-border)]"
                  />
                  <span className="text-xs">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mac-panel bg-[var(--mac-highlight)] bg-opacity-5 p-3">
          <div className="flex items-center">
            <span className={`mac-status ${notificationSettings.enabled ? 'active' : 'inactive'}`} />
            <p className="text-xs text-[var(--mac-text-secondary)]">
              {notificationSettings.enabled
                ? 'System is actively monitoring wallet activities'
                : 'Enable notifications to start monitoring'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};