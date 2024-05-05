"use client";
import React from "react";
import { ProductClient } from "./components/client";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { ProductColumn } from "./components/columns";
import useSWR from "swr";
import Error from "@/components/error";
import Loading from "@/components/loading";

const ProductsPage = ({ params }: { params: { storeId: string } }) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${params.storeId}/products`
  );

  if (error) return <Error />;
  if (!data) return <Loading />;

  const formattedProducts: ProductColumn[] = data.map(
    (item: {
      id: any;
      name: any;
      isFeatured: any;
      isArchived: any;
      price: number | bigint;
      category: { name: any };
      createdAt: any;
    }) => ({
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price:
        typeof item.price === "bigint"
          ? formatter.format(Number(item.price))
          : formatter.format(item.price),
      category: item.category.name,
      createdAt: format(item.createdAt, "MMM do, yyyy"),
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
