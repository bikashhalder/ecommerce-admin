"use client";
import React from "react";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import useSWR from "swr";
import Error from "@/components/error";
import Loading from "@/components/loading";

const CategoriesPage = ({ params }: { params: { storeId: string } }) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${params.storeId}/categories`
  );

  if (error) return <Error />;
  if (!data) return <Loading />;

  const formatedCategories: CategoryColumn[] = data.map(
    (item: {
      id: any;
      name: any;
      billboard: { label: any };
      createdAt: any;
    }) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
