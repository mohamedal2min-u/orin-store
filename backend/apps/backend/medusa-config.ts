import path from 'path'
import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'STORE_CORS',
  'ADMIN_CORS',
  'AUTH_CORS',
] as const

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`[medusa-config] Missing required environment variable: ${key}`)
  }
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    }
  },
  modules: [
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          // Use local file provider when R2 credentials are not configured (local dev)
          ...(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
            ? [
                {
                  resolve: '@medusajs/file-s3',
                  id: 's3',
                  options: {
                    file_url: process.env.R2_PUBLIC_URL,
                    access_key_id: process.env.R2_ACCESS_KEY_ID,
                    secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
                    region: 'auto',
                    bucket: process.env.R2_BUCKET,
                    endpoint: process.env.R2_ENDPOINT,
                    additional_client_config: {
                      forcePathStyle: false,
                    },
                  },
                },
              ]
            : [
                {
                  resolve: '@medusajs/medusa/file-local',
                  id: 'local',
                  options: {
                    upload_dir: 'static',
                    backend_url: 'http://localhost:9000/static',
                  },
                },
              ]),
        ],
      },
    },
    ...(process.env.STRIPE_API_KEY
      ? [
          {
            resolve: '@medusajs/medusa/payment',
            options: {
              providers: [
                {
                  resolve: '@medusajs/payment-stripe',
                  id: 'stripe',
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []),
  ]
})
