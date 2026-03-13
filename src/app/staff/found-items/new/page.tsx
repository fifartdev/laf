"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { foundItemSchema, type FoundItemFormData } from "@/lib/validations/foundItemSchema";
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

export default function NewFoundItemPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FoundItemFormData>({
    resolver: zodResolver(foundItemSchema),
    defaultValues: {
      hotelId: "hotel-1",
    },
  });

  async function onSubmit(data: FoundItemFormData) {
    setError(null);
    const res = await fetch("/api/found-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to log item");
      return;
    }
    const json = await res.json();
    router.push(`/staff/found-items/${json.data.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Log a found item</h1>
      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
          <CardDescription>
            Enter as much detail as possible to help match with guest reports.
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
              placeholder="e.g. iPhone in clear case"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              id="description"
              label="Description"
              placeholder="Describe colour, brand, distinguishing features..."
              rows={3}
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
                id="dateFound"
                label="Date found"
                type="date"
                error={errors.dateFound?.message}
                {...register("dateFound")}
              />
              <Input
                id="locationFound"
                label="Where found"
                placeholder="e.g. Pool deck, lobby"
                error={errors.locationFound?.message}
                {...register("locationFound")}
              />
            </div>
            <Input
              id="storageLocation"
              label="Storage location"
              placeholder="e.g. Front desk drawer #3"
              error={errors.storageLocation?.message}
              {...register("storageLocation")}
            />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Log item
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
