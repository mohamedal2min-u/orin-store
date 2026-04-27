import { ExecArgs } from "@medusajs/framework/types"

export default async function listServices({ container }: ExecArgs) {
  // @ts-ignore
  const registrations = container.registrations
  console.log("Available Container Keys:")
  for (const key in registrations) {
    console.log(key)
  }
}
