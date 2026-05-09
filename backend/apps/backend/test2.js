const fs = require('fs');

async function run() {
  try {
    const file = fs.readFileSync('C:/Users/moham/Desktop/orin.se/data/imports/orin-products-template.csv', 'utf8');
    const lines = file.split('\n');
    console.log("Header cols:", lines[0].split(',').length);
    console.log("Row 2 cols:", lines[1].split(',').length);
    console.log("Headers:", lines[0]);
  } catch(e) {
    console.error(e);
  }
}
run();
