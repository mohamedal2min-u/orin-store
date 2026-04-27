const fs = require('fs');

const inputPath = 'C:\\Users\\moham\\Desktop\\medusa-products-final.csv';
const testOutputPath = 'C:\\Users\\moham\\Desktop\\medusa-products-test-no-images.csv';
const fullOutputPath = 'C:\\Users\\moham\\Desktop\\medusa-products-full-no-images.csv';

function parseCSVFull(str) {
  const rows = [];
  let fields = [], field = '', inQ = false, i = 0;
  while (i < str.length) {
    const ch = str[i], nx = str[i + 1];
    if (inQ) {
      if (ch === '"' && nx === '"') { field += '"'; i += 2; }
      else if (ch === '"') { inQ = false; i++; }
      else { field += ch; i++; }
    } else {
      if (ch === '"') { inQ = true; i++; }
      else if (ch === ',') { fields.push(field); field = ''; i++; }
      else if (ch === '\r' && nx === '\n') {
        fields.push(field); rows.push(fields); fields = []; field = ''; i += 2;
      } else if (ch === '\n') {
        fields.push(field); rows.push(fields); fields = []; field = ''; i++;
      } else { field += ch; i++; }
    }
  }
  if (field || fields.length) { fields.push(field); rows.push(fields); }
  return rows;
}

function writeCSV(rows) {
  return rows.map(row => 
    row.map(field => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',')
  ).join('\r\n');
}

const text = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
const rows = parseCSVFull(text);

const headerRow = rows[0];

// Define columns to remove
const colsToRemove = new Set([
  'Product Thumbnail',
  'Variant Price EUR',
  'Variant Price USD'
]);
for (let i = 1; i <= 9; i++) {
  colsToRemove.add('Product Image ' + i + ' Url');
}

const keepIndices = [];
for (let i = 0; i < headerRow.length; i++) {
  if (!colsToRemove.has(headerRow[i])) {
    keepIndices.push(i);
  }
}

const priceSekIdx = headerRow.indexOf('Variant Price SEK');

const processRow = (row) => {
  if (row.length <= 1 && row[0] === '') return null; // skip empty
  const newRow = [];
  for (let i = 0; i < keepIndices.length; i++) {
    const idx = keepIndices[i];
    let val = row[idx] || '';
    if (idx === priceSekIdx && val.endsWith('.00')) {
      val = val.slice(0, -3); // remove .00
    }
    newRow.push(val);
  }
  return newRow;
};

const processedRows = [];
processedRows.push(keepIndices.map(idx => headerRow[idx])); // New headers

for (let i = 1; i < rows.length; i++) {
  const p = processRow(rows[i]);
  if (p) processedRows.push(p);
}

// Write full output without BOM
fs.writeFileSync(fullOutputPath, writeCSV(processedRows), 'utf8');

// The test file should contain first 3 products.
// Let's count products by counting rows that have a handle, but usually each row is a variant.
// Wait, the user specifically wants the first 3 products. Let's just grab the first 3 rows of data since in this CSV, it appears one row = one variant = one product.
const testRows = [processedRows[0], processedRows[1], processedRows[2], processedRows[3]];
fs.writeFileSync(testOutputPath, writeCSV(testRows), 'utf8');

console.log('Test file created: medusa-products-test-no-images.csv');
console.log('Full file created: medusa-products-full-no-images.csv');
console.log('Original columns:', headerRow.length);
console.log('Columns kept:', keepIndices.length);
console.log('Data rows processed:', processedRows.length - 1);
