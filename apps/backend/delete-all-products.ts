import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { ExecArgs } from "@medusajs/types"

export default async function deleteAllProducts({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )

  console.log("Fetching all products...")
  const products = await productModuleService.listProducts({}, { select: ["id"] })

  if (products.length === 0) {
    console.log("No products found to delete.")
    return
  }

  const productIds = products.map((p) => p.id)
  console.log(`Deleting ${productIds.length} products...`)

  await productModuleService.deleteProducts(productIds)

  console.log("Successfully deleted all products.")
}
