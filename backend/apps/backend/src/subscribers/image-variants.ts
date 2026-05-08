import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { IFileModuleService } from "@medusajs/framework/types"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"

const VARIANTS = [
  { suffix: "-thumb", width: 300 },
  { suffix: "-medium", width: 600 },
  { suffix: "-large", width: 1200 },
] as const

// Matches keys that are already variants — prevents re-processing derived files.
const VARIANT_KEY_PATTERN = /-(?:thumb|medium|large)\.webp$/

function buildS3Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: false, // R2 requires subdomain-style URLs
  })
}

export default async function imageVariantsHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const fileService = container.resolve<IFileModuleService>(Modules.FILE)

  const file = await fileService.retrieveFile(event.data.id)

  // Derive the R2 storage key from the URL pathname.
  // file.url: "https://cdn.orin.se/products/abc/main.webp"
  // storageKey: "products/abc/main.webp"
  const storageKey = new URL(file.url).pathname.replace(/^\//, "")

  // Skip derived variant files — safety guard in case this event ever fires
  // for a variant through a different code path.
  if (VARIANT_KEY_PATTERN.test(storageKey)) {
    return
  }

  // Fetch original binary directly from R2 via the file module (no CDN hop).
  const originalBuffer = await fileService.getAsBuffer(event.data.id)

  const s3 = buildS3Client()
  const bucket = process.env.R2_BUCKET!

  // Upload variants directly to R2 via the S3 API to control the exact key
  // and avoid triggering another file.uploaded event through Medusa's file
  // service (which would cause an infinite processing loop).
  //
  // TODO: Replace with a job queue (e.g. Medusa workflow or BullMQ) if
  // bulk admin uploads cause CPU spikes. Sequential processing is fine for MVP.
  for (const { suffix, width } of VARIANTS) {
    const variantBuffer = await sharp(originalBuffer)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    // "products/abc/main.webp" → "products/abc/main-thumb.webp"
    const variantKey = storageKey.replace(/\.[^.]+$/, `${suffix}.webp`)

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: variantKey,
        Body: variantBuffer,
        ContentType: "image/webp",
      })
    )
  }
}

export const config: SubscriberConfig = {
  event: "file.uploaded",
}
