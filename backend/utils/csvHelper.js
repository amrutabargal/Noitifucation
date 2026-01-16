/**
 * CSV Helper - Handles CSV generation with fallback
 */
let stringify;

try {
  // Try to use csv-stringify package
  const csvModule = require('csv-stringify/sync');
  stringify = csvModule.stringify || csvModule;
} catch (e) {
  // Fallback: manual CSV generation
  stringify = (data, options = {}) => {
    if (!data || data.length === 0) {
      return options.header ? '' : '';
    }

    const rows = [];
    
    // Add header if requested
    if (options.header !== false) {
      const headers = Object.keys(data[0]);
      rows.push(headers.join(','));
    }

    // Add data rows
    data.forEach(row => {
      const values = Object.keys(row).map(key => {
        let val = row[key] || '';
        // Convert to string
        if (val === null || val === undefined) {
          val = '';
        } else {
          val = String(val);
        }
        // Escape commas and quotes
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      rows.push(values.join(','));
    });

    return rows.join('\n');
  };
}

module.exports = { stringify };

