# Clerk OAuth Fix - CSP and Sandbox Iframe Errors

## Problem Identified

The console errors revealed that Clerk's OAuth was failing due to:

1. **Content Security Policy (CSP) blocking**: "Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set"
2. **accounts.bur0.click DNS conflict**: This DNS record was forcing Clerk to use hosted mode (iframe) instead of Component mode, causing CSP violations

## Root Cause

Even though you selected "Component mode" in Clerk's Paths settings, the presence of `accounts.bur0.click` DNS record was overriding this configuration and forcing Clerk to load authentication in an iframe, which triggered browser security restrictions.

## Solution Applied

### 1. Added Content Security Policy Headers (`next.config.ts`)

Added CSP headers to allow Clerk's domains and OAuth providers:

```typescript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.bur0.click https://*.clerk.accounts.dev https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://clerk.bur0.click https://*.clerk.accounts.dev https://api.stripe.com https://*.google.com https://*.facebook.com https://*.facebook.net",
            "frame-src 'self' https://clerk.bur0.click https://*.clerk.accounts.dev https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com",
            "worker-src 'self' blob:",
          ].join("; "),
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
      ],
    },
  ];
}
```

### 2. Added CLERK_DOMAIN to `.env.local`

```bash
CLERK_DOMAIN=clerk.bur0.click
```

This explicitly tells Clerk to use `clerk.bur0.click` for API calls instead of trying to use `accounts.bur0.click`.

### 3. Added Appearance Configuration to ClerkProvider

In `app/layout.tsx`, added appearance prop to suppress development warnings:

```tsx
<ClerkProvider
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/dashboard"
  appearance={{
    layout: {
      unsafe_disableDevelopmentModeWarnings: true,
    },
  }}
>
```

## Next Steps - Deploy to Vercel

1. **Add the new environment variable to Vercel**:

   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `CLERK_DOMAIN` = `clerk.bur0.click`

2. **Redeploy**:

   - Push these changes to your repository
   - Vercel will automatically rebuild with the new CSP headers

3. **Test OAuth**:
   - Try Google OAuth at `https://www.bur0.click/sign-up`
   - Try Facebook OAuth
   - The iframe/sandbox errors should be resolved

## About accounts.bur0.click

You can leave the `accounts.bur0.click` DNS record configured for SSL certificate purposes. The `CLERK_DOMAIN` environment variable will ensure your app uses `clerk.bur0.click` for authentication API calls, preventing the iframe/CSP issues.

## Expected Outcome

- ✅ No more "Blocked script execution in 'about:blank'" errors
- ✅ Google OAuth should work (return 200 instead of 400)
- ✅ Facebook OAuth should work
- ✅ Authentication happens directly on www.bur0.click (Component mode)
- ✅ No iframe sandboxing issues

## Verification

After deploying, check:

1. Browser console should be clean (no CSP errors)
2. Network tab should show successful OAuth callbacks
3. Authentication should complete without errors
4. Users should be redirected to /dashboard after sign-up/sign-in
