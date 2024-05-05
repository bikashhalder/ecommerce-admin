"use client";
import React from "react";
import { BillboardsClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";
import useSWR from "swr";
import Error from "@/components/error";
import Loading from "@/components/loading";

const BillboardsPage = ({ params }: { params: { storeId: string } }) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${params.storeId}/billboards`
  );

  if (error) return <Error />;
  if (!data) return <Loading />;

  const formattedBillboards: BillboardColumn[] = data.map(
    (item: { id: any; label: any; createdAt: any }) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
