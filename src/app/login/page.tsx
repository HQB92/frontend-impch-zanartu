'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/contexts/auth-context";
import { Loader } from "@/components/loader";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loader while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  // Don't render login form if already authenticated (redirect is in progress)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
