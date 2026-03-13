"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { lostItemSchema, type LostItemFormData } from "@/lib/validations/lostItemSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories (bags, wallets)" },
  { value: "documents", label: "Documents" },
  { value: "keys", label: "Keys" },
  { value: "luggage", label: "Luggage" },
  { value: "jewelry", label: "Jewelry" },
  { value: "other", label: "Other" },
];

export default function NewReportPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LostItemFormData>({
    resolver: zodResolver(lostItemSchema),
    defaultValues: {
      hotelId: "hotel-1", // In production: pulled from session.user.hotelId
    },
  });

  async function onSubmit(data: LostItemFormData) {
    setError(null);
    const res = await fetch("/api/lost-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to submit report");
      return;
    }
    const json = await res.json();
    router.push(`/guest/report/${json.data.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Report a lost item</h1>
      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
          <CardDescription>
            The more detail you provide, the better we can match your item.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <Input
              id="title"
              label="Item name"
              placeholder="e.g. Black iPhone 15 Pro"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              id="description"
              label="Description"
              placeholder="Describe the item in detail — colour, brand, any distinguishing marks..."
              rows={4}
              error={errors.description?.message}
              {...register("description")}
            />
            <Select
              id="category"
              label="Category"
              options={categoryOptions}
              placeholder="Select a category"
              error={errors.category?.message}
              {...register("category")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="dateLastSeen"
                label="Date last seen"
                type="date"
                error={errors.dateLastSeen?.message}
                {...register("dateLastSeen")}
              />
              <Input
                id="locationLastSeen"
                label="Location last seen"
                placeholder="e.g. Pool area, Room 402"
                error={errors.locationLastSeen?.message}
                {...register("locationLastSeen")}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Submit report
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
