"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { Loading } from "./Loading";

export function RouteGuard({ children, requiredRoles = [] }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Check if user is authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [user, isLoading, router, requiredRoles]);

  // Show loading while checking auth
  if (isLoading) {
    return <Loading />;
  }

  // Don't render if not authenticated or not authorized
  if (
    !user ||
    (requiredRoles.length > 0 && !requiredRoles.includes(user.role))
  ) {
    return null;
  }

  return children;
}
