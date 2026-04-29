#!/bin/bash

# STRICT PRODUCTION DEPLOYMENT FLOW FOR orin.se
set -e

echo "------------------------------------------------"
echo "🚀 ORIN PRODUCTION DEPLOYMENT"
echo "------------------------------------------------"

# 1. GitHub Check (Should be handled by the agent before running this script, 
# but we pull here to be sure)
echo "Pulling latest code from GitHub..."
git config --global --add safe.directory /home/orin/htdocs/www.orin.se
git pull origin main

# 2. Build Storefront
echo "Building storefront..."
cd apps/storefront
rm -rf .next
npm install
npm run build

# 3. Restart PM2
echo "Restarting PM2 service: orin-storefront..."
pm2 restart orin-storefront --update-env
pm2 save

# 4. Verification
echo "Verifying deployment..."
sleep 5

# Check localhost port 8000
curl -I http://127.0.0.1:8000

# Check public URLs
echo "Checking https://orin.se..."
curl -I https://orin.se
echo "Checking https://orin.se/products/t-shirt..."
curl -I https://orin.se/products/t-shirt
echo "Checking https://orin.se/cart..."
curl -I https://orin.se/cart

echo "------------------------------------------------"
echo "✅ Deployment completed!"
echo "Verify that no redirects to /se occur."
echo "------------------------------------------------"
