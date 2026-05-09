const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:9000';
const CSV_PATH = 'C:\\Users\\moham\\Desktop\\orin.se\\data\\imports\\orin-products-template.csv';

async function importProducts() {
  // Step 1: Login to get auth token
  console.log('1. Logging in...');
  const loginRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@orin.se', password: 'orin2025!' })
  });

  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error('Login failed:', loginRes.status, err);
    return;
  }

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('   Token received:', token ? 'YES' : 'NO');

  // Step 2: Upload CSV file for import
  console.log('2. Uploading CSV...');
  const csvContent = fs.readFileSync(CSV_PATH);
  
  const FormData = (await import('node:buffer')).Blob ? null : null;
  
  // Create multipart form data manually
  const boundary = '----FormBoundary' + Date.now();
  const fileName = path.basename(CSV_PATH);
  
  const bodyParts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`,
    `Content-Type: text/csv\r\n\r\n`,
    csvContent.toString('utf8'),
    `\r\n--${boundary}--\r\n`
  ];
  
  const body = bodyParts.join('');

  const importRes = await fetch(`${BACKEND_URL}/admin/products/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: body
  });

  console.log('   Import status:', importRes.status);
  const importText = await importRes.text();
  console.log('   Response:', importText.substring(0, 500));
}

importProducts().catch(console.error);
