import { IRegionModuleService } from "@medusajs/types"
import { ExecArgs } from "@medusajs/framework/types"

export default async function listRegions({ container }: ExecArgs) {
  const regionModule: IRegionModuleService = container.resolve("region")
  const regions = await regionModule.listRegions({}, { relations: ["countries"] })
  console.log("Regions found:", JSON.stringify(regions, null, 2))
}
