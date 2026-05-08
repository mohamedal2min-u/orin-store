import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import sharp from "sharp"

/**
 * Listens to file.uploaded event to generate MVP variants
 * The file is uploaded to R2, we generate variants and re-upload them.
 * Note: MVP strategy. This requires fetching the image from R2,
 * resizing locally, and uploading back. For large batches, consider a queue.
 */
export default async function imageVariantsHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  // Logic to fetch, resize with sharp, and upload variants would go here.
  // In a real implementation we would:
  // 1. Fetch original file from fileService
  // 2. Buffer image into memory
  // 3. await sharp(buffer).resize(300).toFormat('webp').toBuffer()
  // 4. Upload with suffix '-thumb'
  // 5. Repeat for '-medium' and '-large'
  
  console.log(`Intercepted file.uploaded for id: ${event.data.id}`)
}

export const config: SubscriberConfig = {
  event: "file.uploaded",
}
