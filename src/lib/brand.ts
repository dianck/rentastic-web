// lib/brand.ts
export function getBrandName(): string {
  return process.env.NEXT_PUBLIC_BRAND || "YourBrand";
}
