# Orin.se - Product Import Strategy

Due to the strict validation of the default Medusa v2 Admin product importer, we have split the product data entry into two separate CSV files. This ensures that the core product data can be uploaded natively without errors, while maintaining a scalable architecture for future automated syncs of detailed watch specifications.

## 1. `orin-products-template.csv`
**Purpose:** This is the strictly formatted core template. It contains exactly the columns recognized by the Medusa Admin UI.
**Action:** You **upload this file directly** through the Medusa Admin Dashboard (`Products -> Import Products`).
**Contents:**
- Standard product information (Handle, Title, Description, Status)
- Media (Thumbnail, Image URLs)
- Variant data (SKU, Barcode, Pricing in SEK)
- Medusa relations (Collection ID, Type ID)

## 2. `orin-watch-metadata.csv`
**Purpose:** This file stores all your custom watch specifications and SEO metadata. The Medusa Admin UI does *not* support custom columns in its default importer.
**Action:** Fill this out alongside the products template. **Do not upload this to the Medusa Admin.** It will be processed later via a custom Node.js import script that injects this data into the Medusa database `metadata` JSON object.
**Contents:**
- `Product Handle`: **Crucial matching key.** This must exactly match the `Product Handle` in the core template to link the specifications to the correct product.
- Watch specs (Garanti, Diameter, Urverk, Material, etc.)
- SEO Metadata (Focus keyword, Meta title, etc.)

## Basic Formatting Rules (Excel / Google Sheets)
- **Encoding:** Always save as **UTF-8** to ensure Swedish characters (å, ä, ö) are preserved. In Excel, choose `Save As -> CSV UTF-8 (Comma delimited)`.
- **Matching Keys:** Ensure the `Product Handle` is identical across both files for the same watch. For example, if a watch handle is `seiko-presage-blue`, use exactly `seiko-presage-blue` in the metadata CSV.
- **Empty Fields:** If a watch does not have a specific feature, simply leave the cell blank. Do not delete the column header.
- **No Extra Columns:** Do not add additional columns to `orin-products-template.csv`, or the Medusa Admin UI will reject the file.
