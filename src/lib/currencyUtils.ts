export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
];

// Exchange rates relative to USD (as of base reference)
// In production, you'd fetch these from an API like exchangerate-api.com
export const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1650,
  ZAR: 18.5,
  KES: 129,
  GHS: 15.5,
  EGP: 49,
  MAD: 10,
  TZS: 2650,
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / exchangeRates[fromCurrency];
  const convertedAmount = amountInUSD * exchangeRates[toCurrency];
  
  return convertedAmount;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};

export const detectCurrencyFromText = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Check for currency codes
  for (const currency of currencies) {
    if (lowerText.includes(currency.code.toLowerCase()) || 
        lowerText.includes(currency.name.toLowerCase())) {
      return currency.code;
    }
  }
  
  // Check for symbols
  if (lowerText.includes('$')) return 'USD';
  if (lowerText.includes('€')) return 'EUR';
  if (lowerText.includes('£') && lowerText.includes('uk')) return 'GBP';
  if (lowerText.includes('₦') || lowerText.includes('naira')) return 'NGN';
  
  // Default to USD
  return 'USD';
};