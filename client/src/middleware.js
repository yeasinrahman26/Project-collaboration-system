import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_secret_key",
);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/signup", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // No token and not public route → redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has token and on public route → redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verify token for protected routes
  if (token && !isPublicRoute) {
    try {
      const verified = await jwtVerify(token, secret);
      const userRole = verified.payload.role;

      // Role-based access control
      const roleBasedAccess = {
        Admin: [
          "/dashboard",
          "/dashboard/projects",
          "/dashboard/tasks",
          "/dashboard/addTask",
          "/dashboard/users",
          "/dashboard/search",
        ],
        ProjectManager: [
          "/dashboard",
          "/dashboard/projects",
          "/dashboard/tasks",
          "/dashboard/addTask",
          "/dashboard/search",
        ],
        TeamMember: ["/dashboard", "/dashboard/tasks", "/dashboard/search"],
      };

      const allowedRoutes = roleBasedAccess[userRole] || [];
      const hasAccess = allowedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (!hasAccess) {
        // User doesn't have access to this route
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      // Invalid token → redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
