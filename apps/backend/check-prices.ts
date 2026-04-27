import { ExecArgs } from "@medusajs/framework/types"

export default async function checkPrices({ container }: ExecArgs) {
  const query = container.resolve("query")
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "sku", "calculated_price.*", "price_set.*"]
  })
  
  console.log("Prices for first 3 variants:")
  console.log(JSON.stringify(variants.slice(0, 3), null, 2))
}
