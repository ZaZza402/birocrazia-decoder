# 🚨 EMERGENCY FIX - Authentication Not Working

## The Problem

- Google OAuth is failing with "Missing client_id" error
- This is because Google OAuth is NOT configured in your **PRODUCTION** Clerk instance
- In testing, you used TEST keys which had Google OAuth enabled
- In production, you switched to LIVE keys, but Google OAuth was never set up

## IMMEDIATE FIX (Get Access to Your App NOW)

### Option 1: Use Email/Password Sign-in (Fastest)

1. Go to `https://www.bur0.click/sign-up`
2. **DO NOT click Google** - Use email/password instead
3. Enter your email and create a password
4. You should be able to access the dashboard

### Option 2: Enable Google OAuth in Production Clerk (Takes 5-10 minutes)

#### Step 1: Go to Clerk Dashboard

- URL: https://dashboard.clerk.com
- Make sure you're in your **PRODUCTION** instance (not development)

#### Step 2: Enable Google OAuth

1. Click **Configure** → **Social Connections** (left sidebar)
2. Find **Google** in the list
3. Click **Enable** or **Configure**

#### Step 3: Configure Google OAuth

You have 2 options:

**Option A: Use Clerk's Shared OAuth Credentials (Easiest)**

- Just toggle Google ON
- Clerk provides default Google OAuth credentials
- **Downside**: Users will see "Sign in with Clerk" instead of your app name

**Option B: Use Your Own Google OAuth Credentials (Recommended)**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID (or use existing)
3. Add these **Authorized redirect URIs**:
   ```
   https://accounts.bur0.click/v1/oauth_callback
   https://clerk.bur0.click/v1/oauth_callback
   ```
4. Copy the **Client ID** and **Client Secret**
5. Paste them in Clerk → Social Connections → Google settings
6. Click **Save**

#### Step 4: Update Clerk Paths (CRITICAL)

Go to **Configure** → **Paths**:

**For Sign In:**

- Select: **"Component"** (NOT "Account Portal")
- Path: `/sign-in`

**For Sign Up:**

- Select: **"Component"** (NOT "Account Portal")
- Path: `/sign-up`

**After Sign In:**

- Redirect to: `/dashboard`

**After Sign Up:**

- Redirect to: `/dashboard`

Click **Save Changes**

#### Step 5: Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: **burocrazia-decoder**
3. Go to **Settings** → **Environment Variables**
4. Add these variables (copy from `.env.production.example`):

**CRITICAL Variables to Add:**

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

**Make sure these are already set (they should be):**

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=(your Clerk publishable key)
CLERK_SECRET_KEY=(your Clerk secret key)
```

5. Click **Save**
6. Go to **Deployments** → Click on your latest deployment → Click **Redeploy**

#### Step 6: Wait for Deployment

- Vercel will redeploy (takes 1-2 minutes)
- Once done, try signing in again at `https://www.bur0.click/sign-in`

## Why This Happened

In your development/testing environment:

- ✅ You used Clerk TEST keys
- ✅ Google OAuth was configured for test instance
- ✅ Everything worked fine

When you deployed to production:

- ✅ You switched to Clerk LIVE keys (correct)
- ❌ But Google OAuth was NOT configured for production instance
- ❌ Missing environment variables on Vercel
- ❌ Clerk Dashboard paths pointing to "Account Portal" instead of your domain

## Current Status After Latest Code Push

**Commit `cf168d6` includes:**

- ✅ Fixed deprecated Clerk props
- ✅ Using `forceRedirectUrl` to override Clerk settings
- ✅ Sign-in/sign-up pages on your domain
- ✅ Proper middleware configuration

**What's Still Missing (You Must Do):**

1. ⚠️ Enable Google OAuth in production Clerk instance
2. ⚠️ Add Clerk URL environment variables to Vercel
3. ⚠️ Change Clerk Dashboard paths from "Account Portal" to "Component"
4. ⚠️ Redeploy on Vercel after adding environment variables

## Quick Test

After completing steps above:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to `https://www.bur0.click`
3. Click **REGISTRATI**
4. Should see sign-up form on `www.bur0.click/sign-up` (NOT accounts.bur0.click)
5. Try signing up with email/password first
6. If Google OAuth enabled, try that next

## Emergency Fallback

If nothing works:

1. Sign up with email/password at `www.bur0.click/sign-up`
2. Skip Google OAuth for now
3. Once you're in, we can troubleshoot Google OAuth separately

## Need Help?

Check Clerk logs:

- Go to Clerk Dashboard → Monitoring → Logs
- Look for failed authentication attempts
- Error messages will show exactly what's wrong
