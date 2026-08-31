const express = require('express');
const path = require('path');
const { calculateTax } = require('./src/taxCalculator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Kubernetes liveness & readiness probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Tax calculation API endpoint
app.post('/calculate-tax', (req, res) => {
  try {
    const { grossIncome, deductions } = req.body;
    if (grossIncome === undefined || grossIncome === null || grossIncome === '') {
      return res.status(400).json({ error: 'Gross income is required.' });
    }

    const result = calculateTax(grossIncome, deductions);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tax Calculator Application is running on port ${PORT}`);
  });
}

module.exports = app;
