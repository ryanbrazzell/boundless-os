import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { verifyEmail } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || "",
    };
  },
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/verify-email" });
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid verification token");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err: any) => {
        setStatus("error");
        setError(err.error || "Email verification failed. The token may be invalid or expired.");
      });
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verified</CardTitle>
            <CardDescription>Your email has been successfully verified. You can now sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: "/login" as any })} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>{error || "Email verification failed."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: "/login" as any })} className="w-full">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

