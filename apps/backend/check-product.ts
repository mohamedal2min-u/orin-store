import { IProductModuleService } from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"

export default async function checkProduct({ container }: ExecArgs) {
  const productModule: IProductModuleService = container.resolve("product")
  const products = await productModule.listProducts({ title: "Seiko 5 Sports Midi Svart/Stål 38 mm" }, { relations: ["variants", "categories"] })
  
  if (products.length > 0) {
    console.log("Product Metadata:", JSON.stringify(products[0].metadata, null, 2))
    console.log("Product Categories:", products[0].categories?.map(c => c.name))
  } else {
    console.log("Product not found.")
  }
}
