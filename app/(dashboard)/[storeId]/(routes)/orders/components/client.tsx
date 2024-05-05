"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrdersClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrdersClientProps> = ({ data }) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Orders ${data.length}`}
          description='Manage billboard for your store'
        />
      </div>
      <Separator />
      <DataTable searchFieldName='products' columns={columns} data={data} />
      <Separator />
    </>
  );
};
