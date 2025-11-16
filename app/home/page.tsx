"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/src/lib/auth";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams?.get("token");
    const authStatus = searchParams?.get("auth");
    
    if (token && authStatus === "success") {
      saveToken(token);
      setStatus("success");
      setTimeout(() => router.replace("/jobs"), 1000);
      return;
    }
    
    setStatus("error");
    setTimeout(() => router.replace("/auth/login?error=oauth_failed"), 2000);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Completing Google Sign-In...</h2>
          </>
        )}
        {status === "success" && <h2 className="text-2xl font-bold text-green-600">Success! Redirecting...</h2>}
        {status === "error" && <h2 className="text-2xl font-bold text-red-600">Error! Redirecting to login...</h2>}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <OAuthCallbackHandler />
    </Suspense>
  );
}
