import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductsWorkflow, createCollectionsWorkflow } from "@medusajs/medusa/core-flows";
import * as fs from "fs";

function parseCSVFull(str: string) {
  const rows: string[][] = [];
  let fields: string[] = [], field = '', inQ = false, i = 0;
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

export default async function ({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const csvPath = 'C:\\Users\\moham\\Desktop\\medusa-products-full-no-images.csv';
  
  if (!fs.existsSync(csvPath)) {
    logger.error(`File not found: ${csvPath}`);
    return;
  }

  logger.info("Reading CSV...");
  const text = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCSVFull(text);
  
  const headers = rows[0];
  const data = rows.slice(1).filter(r => r.length > 1 && r[0] !== undefined);

  logger.info(`Found ${data.length} product rows to import.`);

  // Find column indices
  const getIdx = (name: string) => headers.indexOf(name);
  const idxHandle = getIdx('Product Handle');
  const idxTitle = getIdx('Product Title');
  const idxSub = getIdx('Product Subtitle');
  const idxDesc = getIdx('Product Description');
  const idxStatus = getIdx('Product Status');
  const idxMat = getIdx('Product Material');
  const idxCollection = getIdx('Product Collection Id'); // Will map to title
  const idxSku = getIdx('Variant SKU');
  const idxBarcode = getIdx('Variant Barcode');
  const idxPrice = getIdx('Variant Price SEK');
  const idxVarTitle = getIdx('Variant Title');
  const idxOptName = getIdx('Variant Option 1 Name');
  const idxOptVal = getIdx('Variant Option 1 Value');

  // We need to group by handle
  const productsMap = new Map<string, any>();

  for (const row of data) {
    const handle = row[idxHandle];
    if (!handle) continue;

    if (!productsMap.has(handle)) {
      productsMap.set(handle, {
        title: row[idxTitle],
        handle: handle,
        subtitle: row[idxSub] || undefined,
        description: row[idxDesc] || undefined,
        status: (row[idxStatus] || "published") as any,
        material: row[idxMat] || undefined,
        options: [],
        variants: []
      });
    }

    const prod = productsMap.get(handle);
    
    // Check if Option exists
    const optName = row[idxOptName] || "Title";
    let existingOpt = prod.options.find((o: any) => o.title === optName);
    if (!existingOpt) {
      existingOpt = { title: optName, values: [] };
      prod.options.push(existingOpt);
    }
    
    const optVal = row[idxOptVal] || "Default Title";
    if (!existingOpt.values.includes(optVal)) {
      existingOpt.values.push(optVal);
    }

    // Prepare variant
    const priceRaw = row[idxPrice] ? row[idxPrice].replace(/\s/g, '').replace(',', '.') : "0";
    const priceNum = parseFloat(priceRaw) || 0;

    prod.variants.push({
      title: row[idxVarTitle] || optVal,
      sku: row[idxSku] || undefined,
      barcode: row[idxBarcode] || undefined,
      options: {
        [optName]: optVal
      },
      prices: [
        {
          currency_code: "sek",
          amount: priceNum
        }
      ]
    });
  }

  const productsToCreate = Array.from(productsMap.values());
  logger.info(`Prepared ${productsToCreate.length} unique products with variants. Importing...`);

  // Import in batches to avoid overwhelming the database
  const batchSize = 10;
  for (let i = 0; i < productsToCreate.length; i += batchSize) {
    const batch = productsToCreate.slice(i, i + batchSize);
    try {
      logger.info(`Importing batch ${Math.floor(i/batchSize) + 1} / ${Math.ceil(productsToCreate.length/batchSize)}`);
      await createProductsWorkflow(container).run({
        input: {
          products: batch,
        },
      });
    } catch (err: any) {
      logger.error(`Failed at batch ${Math.floor(i/batchSize) + 1}: ${err.message}`);
      // Log deep errors
      if (err.response && err.response.data) {
        logger.error(JSON.stringify(err.response.data, null, 2));
      }
    }
  }

  logger.info("✅ Import completed programmatically!");
}
