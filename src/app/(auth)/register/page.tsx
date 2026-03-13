"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterFormData } from "@/lib/validations/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const hotelOptions = [
  { value: "hotel-1", label: "Grand Seaside Hotel" },
  { value: "hotel-2", label: "Mountain View Inn" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Registration failed");
      return;
    }

    // Auto-login after registration
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    router.push("/guest/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Register to report a lost item</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Input
            id="name"
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Select
            id="hotelId"
            label="Hotel"
            options={hotelOptions}
            placeholder="Select your hotel"
            error={errors.hotelId?.message}
            {...register("hotelId")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="roomNumber"
              label="Room number"
              placeholder="e.g. 402"
              error={errors.roomNumber?.message}
              {...register("roomNumber")}
            />
            <Input
              id="phone"
              label="Phone (optional)"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-hotel-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
