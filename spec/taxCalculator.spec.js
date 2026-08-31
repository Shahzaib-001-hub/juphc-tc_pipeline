const { calculateTax } = require('../src/taxCalculator');

describe('Tax Calculator Application - Unit Tests', () => {

  it('should calculate 0% tax for income up to $250,000', () => {
    const result = calculateTax(250000);
    expect(result.totalTax).toBe(0);
    expect(result.netIncome).toBe(250000);
  });

  it('should calculate 5% tax for income between $250,001 and $500,000', () => {
    const result = calculateTax(400000);
    expect(result.totalTax).toBe(7500);
    expect(result.netIncome).toBe(392500);
  });

  it('should calculate 20% tax for income between $500,001 and $1,000,000', () => {
    const result = calculateTax(800000);
    expect(result.totalTax).toBe(72500);
    expect(result.netIncome).toBe(727500);
  });

  it('should calculate 30% tax for income exceeding $1,000,000', () => {
    const result = calculateTax(1500000);
    expect(result.totalTax).toBe(262500);
    expect(result.netIncome).toBe(1237500);
  });

  it('should calculate tax accurately with allowable deductions', () => {
    const result = calculateTax(800000, 100000);
    expect(result.taxableIncome).toBe(700000);
    expect(result.totalTax).toBe(52500);
  });

  it('should return 0 tax when deductions exceed gross income', () => {
    const result = calculateTax(300000, 400000);
    expect(result.taxableIncome).toBe(0);
    expect(result.totalTax).toBe(0);
  });

  it('should throw an error for negative income', () => {
    expect(() => calculateTax(-5000)).toThrowError('Invalid income. Gross income must be a non-negative number.');
  });

});
