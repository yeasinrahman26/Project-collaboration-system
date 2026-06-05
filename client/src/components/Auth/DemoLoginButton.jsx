"use client";

import { useState } from "react";
import { Button } from "@/components/Common/Button";
import { useAuth } from "@/lib/hooks";
import toast from "react-hot-toast";

export function DemoLoginButton() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      await login("admin@demo.com", "password123");
      toast.success("Logged in with demo account!");
    } catch (error) {
      toast.error(error?.data?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDemoLogin}
      loading={loading}
      variant="outline"
      className="w-full"
    >
      Demo Login (Admin)
    </Button>
  );
}
