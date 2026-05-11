"use client";

import Image from "next/image";
import { Badge, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@shared/components";
import { formatPrice } from "@shared/utils";
import type { Product } from "../types/catalog.types";

interface ProductCardProps {
  product: Product;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="danger">Sin stock</Badge>;
  if (stock <= 5)
    return (
      <Badge variant="warning">
        {stock} {stock === 1 ? "unidad" : "unidades"}
      </Badge>
    );
  return <Badge variant="success">En stock</Badge>;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.sort((a, b) => a.position - b.position)[0];
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "http://localhost:3001";

  function resolveImageUrl(url: string): string {
    if (url.startsWith("http")) return url;
    return `${apiBase}${url}`;
  }

  return (
    <Card
      hoverable
      padded={false}
      href={product.stock === 0 ? undefined : `/products/${product.slug}`}
      className="flex flex-col overflow-hidden"
    >
      <div className="relative aspect-4/3 bg-card overflow-hidden">
        {primaryImage ? (
          <Image
            src={resolveImageUrl(primaryImage.url)}
            alt={primaryImage.altText ?? product.name}
            fill
            unoptimized
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl opacity-20">📱</span>
          </div>
        )}
      </div>

      <CardHeader className="px-5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-text-subtle mb-0.5">{product.brand.name}</p>
            <CardTitle className="truncate">{product.name}</CardTitle>
            {product.category && <CardDescription>{product.category.name}</CardDescription>}
          </div>
          <StockBadge stock={product.stock} />
        </div>
      </CardHeader>

      <CardFooter className="mt-auto mx-5 mb-5">
        <span className="font-display text-xl font-bold text-text">{formatPrice(product.price)}</span>
      </CardFooter>
    </Card>
  );
}
