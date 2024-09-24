import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/favicon.ico", "/api/uploadthing"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
