// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Auth is NOT required on these
  publicRoutes: [
    '/',               // landing
    '/sign-in(.*)',    // Clerk sign-in
    '/sign-up(.*)',    // Clerk sign-up
    '/api/webhooks(.*)'
  ],
  // optional: keep dev logs quiet
  // debug: false,
});

// Only run middleware on real app/API paths.
// Skips /_next/*, *.js|css|png|ico, etc.
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
