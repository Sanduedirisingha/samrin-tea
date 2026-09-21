/** Prices are stored in minor units (cents): 32000 → "Rs. 320.00". */
const formatter = new Intl.NumberFormat("en-LK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatLkr(minorUnits: number): string {
  return `Rs. ${formatter.format(minorUnits / 100)}`;
}

/** Plain decimal string for structured data ("320.00"). */
export function lkrDecimal(minorUnits: number): string {
  return (minorUnits / 100).toFixed(2);
}
