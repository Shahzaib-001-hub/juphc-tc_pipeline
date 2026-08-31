const { calculateTax, TAX_BRACKETS } = require('../src/taxCalculator');

describe('Tax Calculator Business Logic Unit Tests', () => {

  it('should have predefined tax brackets defined', () => {
    expect(TAX_BRACKETS).toBeDefined();
    expect(TAX_BRACKETS.length).toBe(4);
  });

  describe('Zero and Exempt Income Calculations', () => {
    it('should return 0 tax for 0 income', () => {
      const result = calculateTax(0);
      expect(result.taxableIncome).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(0);
      expect(result.effectiveRate).toBe('0.00%');
    });

    it('should return 0 tax for income below exemption slab (e.g. $200,000)', () => {
      const result = calculateTax(200000);
      expect(result.taxableIncome).toBe(200000);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(200000);
      expect(result.effectiveRate).toBe('0.00%');
      expect(result.breakdown.length).toBe(0);
    });

    it('should return 0 tax for income exactly at exemption limit ($250,000)', () => {
      const result = calculateTax(250000);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(250000);
    });
  });

  describe('Tax Bracket Calculations', () => {
    it('should calculate 5% tax for income between 250,001 and 500,000', () => {
      // Income = 400,000 -> Taxable in 5% bracket = 150,000 -> Tax = 7,500
      const result = calculateTax(400000);
      expect(result.totalTax).toBe(7500);
      expect(result.netIncome).toBe(392500);
      expect(result.effectiveRate).toBe('1.88%');
    });

    it('should calculate 20% bracket tax for income up to 1,000,000', () => {
      // Income = 800,000
      // 0-250k: 0
      // 250k-500k (250k @ 5%): 12,500
      // 500k-800k (300k @ 20%): 60,000
      // Total tax = 72,500
      const result = calculateTax(800000);
      expect(result.totalTax).toBe(72500);
      expect(result.netIncome).toBe(727500);
      expect(result.effectiveRate).toBe('9.06%');
    });

    it('should calculate 30% top bracket tax for high income earners', () => {
      // Income = 1,500,000
      // 0-250k: 0
      // 250k-500k (250k @ 5%): 12,500
      // 500k-1M (500k @ 20%): 100,000
      // > 1M (500k @ 30%): 150,000
      // Total tax = 262,500
      const result = calculateTax(1500000);
      expect(result.totalTax).toBe(262500);
      expect(result.netIncome).toBe(1237500);
      expect(result.effectiveRate).toBe('17.50%');
    });
  });

  describe('Deduction Calculations', () => {
    it('should correctly reduce taxable income when deductions are provided', () => {
      // Gross = 800,000, Deductions = 100,000 -> Taxable = 700,000
      // 0-250k: 0
      // 250k-500k: 12,500
      // 500k-700k (200k @ 20%): 40,000
      // Total tax = 52,500
      const result = calculateTax(800000, 100000);
      expect(result.grossIncome).toBe(800000);
      expect(result.deductions).toBe(100000);
      expect(result.taxableIncome).toBe(700000);
      expect(result.totalTax).toBe(52500);
      expect(result.netIncome).toBe(747500);
    });

    it('should handle deductions exceeding gross income gracefully', () => {
      const result = calculateTax(300000, 400000);
      expect(result.taxableIncome).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(300000);
    });
  });

  describe('Error Handling and Validation', () => {
    it('should throw an error for negative income', () => {
      expect(() => calculateTax(-5000)).toThrowError('Invalid income. Gross income must be a non-negative number.');
    });

    it('should throw an error for non-numeric input', () => {
      expect(() => calculateTax('invalid_income')).toThrowError('Invalid income. Gross income must be a non-negative number.');
    });
  });

});
