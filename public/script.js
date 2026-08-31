document.getElementById('taxForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const grossIncome = document.getElementById('grossIncome').value;
  const deductions = document.getElementById('deductions').value || 0;

  try {
    const response = await fetch('/calculate-tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grossIncome: parseFloat(grossIncome),
        deductions: parseFloat(deductions)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Failed to calculate tax.'}`);
      return;
    }

    const data = await response.json();

    // Populate summary metrics
    document.getElementById('taxableIncomeVal').textContent = `$${data.taxableIncome.toLocaleString()}`;
    document.getElementById('totalTaxVal').textContent = `$${data.totalTax.toLocaleString()}`;
    document.getElementById('netIncomeVal').textContent = `$${data.netIncome.toLocaleString()}`;
    document.getElementById('effectiveRateVal').textContent = data.effectiveRate;

    // Populate breakdown table
    const tbody = document.getElementById('breakdownBody');
    tbody.innerHTML = '';

    if (data.breakdown && data.breakdown.length > 0) {
      data.breakdown.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.bracket}</td>
          <td>${item.rate}</td>
          <td>$${item.taxableAmount.toLocaleString()}</td>
          <td>$${item.tax.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="4" style="text-align: center; color: #666;">No tax applicable (Income below exemption threshold).</td>`;
      tbody.appendChild(row);
    }

    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Calculation error:', error);
    alert('An unexpected error occurred while calculating tax.');
  }
});
