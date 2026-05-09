const fs = require('fs');
const readline = require('readline');

async function checkMedusa() {
  const content = fs.readFileSync('C:\\Users\\moham\\Desktop\\orin.se\\data\\imports\\orin-products-template.csv', 'utf8');
  console.log("CSV Lines:", content.split('\\n').length);
  console.log("CSV Header cols:", content.split('\\n')[0].split(',').length);
}

checkMedusa();
