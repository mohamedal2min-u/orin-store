const fs = require('fs');

const header = 'Product Id,Product Handle,Product Title,Product Subtitle,Product Description,Product Status,Product Thumbnail,Product Weight,Product Length,Product Width,Product Height,Product HS Code,Product Origin Country,Product MID Code,Product Material,Shipping Profile Id,Product Sales Channel 1,Product Collection Id,Product Type Id,Product Tag 1,Product Discountable,Product External Id,Variant Id,Variant Title,Variant SKU,Variant Barcode,Variant Allow Backorder,Variant Manage Inventory,Variant Weight,Variant Length,Variant Width,Variant Height,Variant HS Code,Variant Origin Country,Variant MID Code,Variant Material,Variant Price EUR,Variant Price USD,Variant Option 1 Name,Variant Option 1 Value,Product Image 1 Url,Product Image 2 Url';

const rows = [
  ',seiko-presage-cocktail-time,Seiko Presage Cocktail Time,Elegant automatisk klocka med isbl\u00e5 urtavla,"En fantastisk dressklocka fr\u00e5n Seiko Presage-serien.",published,https://placehold.co/800x1000?text=Seiko,130,,,,,JP,,Rostfritt st\u00e5l,,,,,Dressklocka,TRUE,,,Standard,SRPB41J1,4954628214643,FALSE,TRUE,,,,,,,,,4995,,Storlek,One Size,https://placehold.co/800x1000?text=Seiko+Front,',
  ',tissot-prx-powermatic-80,Tissot PRX Powermatic 80,Ikonisk retrodesign med 80 timmars g\u00e5ngreserv,"Tissot PRX Powermatic 80 med modern schweizisk urmakarkonst.",published,https://placehold.co/800x1000?text=Tissot,138,,,,,CH,,Rostfritt st\u00e5l,,,,,Sportklocka,TRUE,,,Bl\u00e5,T1374071104100,7611608299647,FALSE,TRUE,,,,,,,,,8495,,F\u00e4rg,Bl\u00e5,https://placehold.co/800x1000?text=Tissot+Front,',
  ',certina-ds-action-diver,Certina DS Action Diver 38mm,Kompakt och robust dykarklocka,"ISO-certifierad dykarklocka fr\u00e5n Certina med DS-konceptet.",published,https://placehold.co/800x1000?text=Certina,150,,,,,CH,,Rostfritt st\u00e5l,,,,,Dykarklocka,TRUE,,,Svart,C0328071105100,7612307147743,TRUE,TRUE,,,,,,,,,9900,,F\u00e4rg,Svart,https://placehold.co/800x1000?text=Certina+Front,'
];

const csv = [header, ...rows].join('\r\n') + '\r\n';

fs.writeFileSync('C:\\Users\\moham\\Desktop\\orin.se\\data\\imports\\orin-products-template.csv', csv, 'utf8');

// Verify
const written = fs.readFileSync('C:\\Users\\moham\\Desktop\\orin.se\\data\\imports\\orin-products-template.csv', 'utf8');
const lines = written.split('\r\n').filter(l => l.length > 0);
console.log('Total data lines:', lines.length);
lines.forEach((line, i) => {
  console.log('Line ' + (i+1) + ' cols: ' + line.split(',').length);
});
console.log('Has CRLF:', written.includes('\r\n'));
console.log('Header match:', lines[0] === header);
