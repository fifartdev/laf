"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      {submitted ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, you&apos;ll receive a reset link
            shortly.
          </p>
        </CardContent>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <CardContent>
            <Input id="email" label="Email" type="email" required />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to sign in
            </Link>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
