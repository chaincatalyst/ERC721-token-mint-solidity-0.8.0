import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { Bell, Volume2, Zap, Shield, Moon, Wallet, X, ExternalLink, CreditCard, Calendar, ArrowRight } from 'lucide-react';

export const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    notificationSettings, 
    updateNotificationSettings, 
    soundEnabled, 
    setSoundEnabled,
    defaultPlatform,
    setDefaultPlatform,
    subscription
  } = useWalletStore();

  const platforms = ['Photon', 'DexScreener', 'BullX', 'Fasol'] as const;

  const sections = [
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you want to be notified about wallet activities',
      settings: [
        {
          id: 'enabled',
          label: 'Enable Notifications',
          type: 'toggle',
          value: notificationSettings.enabled,
          onChange: (value: boolean) => updateNotificationSettings({ enabled: value })
        },
        {
          id: 'minAmount',
          label: 'Minimum Transaction Amount (SOL)',
          type: 'number',
          value: notificationSettings.minAmount,
          onChange: (value: number) => updateNotificationSettings({ minAmount: value })
        }
      ]
    },
    {
      id: 'sound',
      icon: Volume2,
      title: 'Sound & Alerts',
      description: 'Customize notification sounds and alert preferences',
      settings: [
        {
          id: 'sound',
          label: 'Enable Sound',
          type: 'toggle',
          value: soundEnabled,
          onChange: (value: boolean) => setSoundEnabled(value)
        }
      ]
    },
    {
      id: 'platform',
      icon: ExternalLink,
      title: 'Default Platform',
      description: 'Choose your preferred trading analysis platform',
      settings: [
        {
          id: 'platform',
          label: 'Default Platform',
          type: 'select',
          value: defaultPlatform,
          options: platforms,
          onChange: (value: typeof platforms[number]) => setDefaultPlatform(value)
        }
      ]
    },
    {
      id: 'billing',
      icon: CreditCard,
      title: 'Billing & Account',
      description: 'Manage your subscription and payment settings',
      settings: [
        {
          id: 'currentPlan',
          label: 'Current Plan',
          type: 'info',
          value: subscription?.plan || 'Free'
        },
        {
          id: 'nextBilling',
          label: 'Next Billing Date',
          type: 'info',
          value: subscription?.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'
        },
        {
          id: 'paymentMethod',
          label: 'Payment Method',
          type: 'info',
          value: subscription?.paymentMethod || 'None'
        }
      ],
      actions: [
        {
          id: 'changePayment',
          label: 'Change Payment Method',
          icon: CreditCard,
          onClick: () => console.log('Change payment method')
        },
        {
          id: 'changePlan',
          label: 'Change Plan',
          icon: ArrowRight,
          onClick: () => console.log('Change plan')
        },
        {
          id: 'cancelSubscription',
          label: 'Cancel Subscription',
          icon: X,
          onClick: () => console.log('Cancel subscription'),
          variant: 'red'
        }
      ]
    }
  ];

  return (
    <div className="mac-panel">
      {/* Mac-style title bar */}
      <div className="bg-[var(--mac-toolbar)] border-b border-[var(--mac-border)] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:brightness-90 transition-all"
          >
            <X size={12} className="text-[#4c0002]" />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[var(--mac-highlight)]" />
            <h2 className="text-sm font-semibold">Settings</h2>
          </div>
        </div>
      </div>

      {/* Settings content */}
      <div className="p-6 space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <section.icon size={16} className="text-[var(--mac-highlight)]" />
              <h3 className="text-lg font-medium">{section.title}</h3>
            </div>
            <p className="text-sm text-[var(--mac-text-secondary)]">{section.description}</p>
            
            <div className="space-y-4 mt-4">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label className="text-sm font-medium">{setting.label}</label>
                  {setting.type === 'toggle' && (
                    <button
                      onClick={() => setting.onChange?.(!setting.value)}
                      className={`mac-button ${setting.value ? 'active' : ''}`}
                    >
                      {setting.value ? 'Enabled' : 'Disabled'}
                    </button>
                  )}
                  {setting.type === 'number' && (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => setting.onChange?.(Number(e.target.value))}
                      className="mac-input w-24"
                    />
                  )}
                  {setting.type === 'select' && (
                    <select
                      value={setting.value}
                      onChange={(e) => setting.onChange?.(e.target.value as any)}
                      className="mac-input w-32"
                    >
                      {setting.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {setting.type === 'info' && (
                    <span className="text-sm text-[var(--mac-text-secondary)]">{setting.value}</span>
                  )}
                </div>
              ))}
              {section.actions && (
                <div className="pt-4 space-y-2">
                  {section.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className={`mac-button w-full justify-center ${action.variant || ''}`}
                    >
                      <action.icon size={14} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};