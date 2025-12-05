# Bur0 - Quick Start Setup Script
# Run this after pulling the latest code

Write-Host "🚀 Bur0 Setup Script" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Check for .env.local
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "📝 Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created - PLEASE FILL IN YOUR API KEYS!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ .env.local found" -ForegroundColor Green
    Write-Host ""
}

# Step 3: Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Step 4: Push database schema
Write-Host "📊 Updating database schema..." -ForegroundColor Yellow
Write-Host "   (This will update your database with new tables)" -ForegroundColor Gray
$confirmation = Read-Host "   Continue? (y/n)"
if ($confirmation -eq 'y') {
    npx prisma db push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Database push failed! Check your DATABASE_URL" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database schema updated" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipped database push" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Summary
Write-Host "🎉 Setup Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Edit .env.local with your API keys" -ForegroundColor White
Write-Host "   2. Create Stripe products and get Price IDs" -ForegroundColor White
Write-Host "   3. Set up Stripe webhook at /api/webhooks/stripe" -ForegroundColor White
Write-Host "   4. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 Read DEPLOYMENT_GUIDE.md for full setup instructions" -ForegroundColor Cyan
Write-Host ""
