export const formatNumber = (value: string | number | null | undefined, showUSDSymbol = false) => {
  if (value === undefined || value === null) {
    return value;
  }
  const formattedValue = Number(value || 0);

  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
    ...(showUSDSymbol ? { style: 'currency', currency: 'usd' } : {}),
  }).format(formattedValue);
};
