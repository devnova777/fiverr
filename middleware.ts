import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/clerk-middleware
// for more information about configuring your Middleware

const isPublicRoute = createRouteMatcher([
  // Add your public routes here if needed
  // '/sign-in(.*)',
  // '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
};