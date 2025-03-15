import React, { useState } from 'react';
import { X, Check, Zap, Crown, Flame, CreditCard, Wallet, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PremiumModalProps {
  onClose: () => void;
}

interface Plan {
  name: string;
  price: { monthly: string; yearly?: string };
  period: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  features: string[];
  popular?: boolean;
  saveText?: string;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: { 
      monthly: '$9.99',
      yearly: '$95.90'
    },
    period: 'month',
    icon: Zap,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    features: [
      'Track up to 15 KOL wallets',
      'View last 500 transactions per wallet',
      'Detailed wallet analytics',
      'Faster trade data (5-minute delay)',
      'Weekly KOL performance report',
      'Access to Solana-only data'
    ],
    saveText: 'Save 20% yearly'
  },
  {
    name: 'Pro',
    price: { 
      monthly: '$29.99',
      yearly: '$287.90'
    },
    period: 'month',
    icon: Crown,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    features: [
      'Unlimited KOL wallet tracking',
      'Full transaction history (up to 1,000)',
      'Real-time trade alerts',
      'Advanced analytics & risk scores',
      'Trade copying tool',
      'Priority 24/7 support',
      'Exclusive market insights',
      'Historical patterns analysis'
    ],
    popular: true,
    saveText: 'Save 20% yearly'
  },
  {
    name: 'Degen Pass',
    price: { 
      monthly: '$6.99'
    },
    period: '24 hours',
    icon: Flame,
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    features: [
      'Unlimited KOL wallet tracking',
      'Full transaction history',
      'Real-time trade alerts',
      'Advanced analytics & charts',
      'Trade copying tool',
      'Priority support',
      'Exclusive market insights',
      'Valid for 24 hours only'
    ]
  }
];

const cryptoOptions = [
  {
    name: 'SOL',
    address: '9m5qFVqkqT8TJpBB4bCkYxZBJEJCPTgUxZrRVUPKXxsP',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    name: 'USDC',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  }
];

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto' | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoOptions[0] | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleBack = () => {
    if (selectedCrypto) {
      setSelectedCrypto(null);
    } else if (paymentMethod) {
      setPaymentMethod(null);
    } else if (selectedPlan) {
      setSelectedPlan(null);
    }
  };

  const handleStripePayment = async () => {
    // Implement Stripe payment logic here
    console.log('Processing Stripe payment for', selectedPlan?.name);
  };

  if (selectedPlan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 backdrop-blur-[70px]" onClick={onClose} />
        <div className="relative w-full max-w-lg">
          <div className="mac-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleBack} className="mac-button">
                <ChevronLeft size={14} className="mr-1" />
                Back
              </button>
              <button onClick={onClose} className="mac-button">
                <X size={14} />
              </button>
            </div>

            {!paymentMethod ? (
              <div>
                <h2 className="text-xl font-bold mb-6">Choose Payment Method</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className="mac-panel w-full p-4 flex items-center hover:brightness-105 transition-all"
                  >
                    <CreditCard size={24} className="mr-4" />
                    <div className="flex-grow text-left">
                      <h3 className="font-semibold">Pay with Card</h3>
                      <p className="text-sm text-[var(--mac-text-secondary)]">Secure payment via Stripe</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className="mac-panel w-full p-4 flex items-center hover:brightness-105 transition-all"
                  >
                    <Wallet size={24} className="mr-4" />
                    <div className="flex-grow text-left">
                      <h3 className="font-semibold">Pay with Crypto</h3>
                      <p className="text-sm text-[var(--mac-text-secondary)]">SOL, USDC</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : paymentMethod === 'stripe' ? (
              <div>
                <h2 className="text-xl font-bold mb-6">Card Payment</h2>
                <div className="mac-panel p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span>Total Amount:</span>
                    <span className="font-bold">
                      {selectedPlan.price[billingPeriod === 'yearly' ? 'yearly' : 'monthly']}
                    </span>
                  </div>
                  <button onClick={handleStripePayment} className="mac-button green w-full justify-center">
                    Pay with Stripe
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {!selectedCrypto ? (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Select Crypto</h2>
                    <div className="space-y-4">
                      {cryptoOptions.map((crypto) => (
                        <button
                          key={crypto.name}
                          onClick={() => setSelectedCrypto(crypto)}
                          className="mac-panel w-full p-4 flex items-center hover:brightness-105 transition-all"
                        >
                          <img src={crypto.icon} alt={crypto.name} className="w-6 h-6 mr-4" />
                          <span className="font-semibold">{crypto.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Pay with {selectedCrypto.name}</h2>
                    <div className="mac-panel p-6 text-center">
                      <QRCodeSVG
                        value={selectedCrypto.address}
                        size={200}
                        className="mx-auto mb-4"
                        level="H"
                      />
                      <p className="text-sm mb-2">
                        Send {selectedPlan.price[billingPeriod === 'yearly' ? 'yearly' : 'monthly']} worth of {selectedCrypto.name} to:
                      </p>
                      <div className="mac-panel bg-[var(--mac-window-bg)] p-2 break-all text-xs mb-4">
                        {selectedCrypto.address}
                      </div>
                      <p className="text-xs text-[var(--mac-text-secondary)]">
                        Your subscription will be activated automatically after payment confirmation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-[70px]" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div className="mac-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
            <div className="flex items-center space-x-2">
              {plans[0].price.yearly && (
                <div className="flex items-center bg-[var(--mac-metal)] rounded-lg p-1">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      billingPeriod === 'monthly' ? 'bg-[var(--mac-highlight)] text-white' : ''
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      billingPeriod === 'yearly' ? 'bg-[var(--mac-highlight)] text-white' : ''
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              )}
              <button onClick={onClose} className="mac-button">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`mac-panel p-6 relative overflow-hidden transition-all hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-purple-500' : 
                  plan.name === 'Degen Pass' ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.name === 'Degen Pass' && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full">
                      24H Access
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-lg ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    {plan.price[billingPeriod === 'yearly' && plan.price.yearly ? 'yearly' : 'monthly']}
                  </span>
                  <span className="text-sm text-[var(--mac-text-secondary)]">/{plan.period}</span>
                  {plan.saveText && billingPeriod === 'yearly' && (
                    <div className="text-xs text-green-500 font-medium mt-1">{plan.saveText}</div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`mac-button w-full justify-center ${
                    plan.popular ? 'purple' : 
                    plan.name === 'Basic' ? 'blue' : 
                    plan.name === 'Degen Pass' ? 'orange' : ''
                  }`}
                >
                  Get {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-[var(--mac-text-secondary)]">
            Questions? Contact us at{' '}
            <a href="mailto:support@chainspy.com" className="text-[var(--mac-highlight)]">
              support@chainspy.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};