/**
 * Tax Calculator Business Logic Module
 */

// Progressive tax brackets configuration
const TAX_BRACKETS = [
  { min: 0, max: 250000, rate: 0.00 },        // Up to 250,000: 0%
  { min: 250000, max: 500000, rate: 0.05 },    // 250,001 to 500,000: 5%
  { min: 500000, max: 1000000, rate: 0.20 },   // 500,001 to 1,000,000: 20%
  { min: 1000000, max: Infinity, rate: 0.30 }  // Above 1,000,000: 30%
];

/**
 * Calculates progressive tax based on annual gross income and deductions.
 * 
 * @param {number} grossIncome - Annual gross income
 * @param {number} deductions - Total allowable tax deductions (default 0)
 * @returns {object} Breakdown of taxable income, total tax, and effective tax rate
 */
function calculateTax(grossIncome, deductions = 0) {
  const income = parseFloat(grossIncome);
  const ded = Math.max(0, parseFloat(deductions) || 0);

  if (isNaN(income) || income < 0) {
    throw new Error("Invalid income. Gross income must be a non-negative number.");
  }

  const taxableIncome = Math.max(0, income - ded);
  let totalTax = 0;
  const breakdown = [];

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome > bracket.min) {
      const taxableAmountInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxForBracket = taxableAmountInBracket * bracket.rate;
      totalTax += taxForBracket;

      if (bracket.rate > 0 && taxableAmountInBracket > 0) {
        breakdown.push({
          bracket: bracket.max === Infinity ? `> ${bracket.min}` : `${bracket.min} - ${bracket.max}`,
          rate: `${bracket.rate * 100}%`,
          taxableAmount: taxableAmountInBracket,
          tax: taxForBracket
        });
      }
    }
  }

  const netIncome = income - totalTax;
  const effectiveRate = income > 0 ? ((totalTax / income) * 100).toFixed(2) : "0.00";

  return {
    grossIncome: income,
    deductions: ded,
    taxableIncome,
    totalTax: Math.round(totalTax * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    effectiveRate: `${effectiveRate}%`,
    breakdown
  };
}

module.exports = {
  calculateTax,
  TAX_BRACKETS
};
