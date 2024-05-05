"use client";
import React from "react";
import { OrderClient } from "./components/client";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import useSWR from "swr";
import Error from "@/components/error";
import Loading from "@/components/loading";

const OrdersPage = ({ params }: { params: { storeId: string } }) => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${params.storeId}/orders`
  );

  if (error) return <Error />;
  if (!data) return <Loading />;

  const formatedOrders: OrderColumn[] = data.map(
    (item: {
      id: any;
      phone: any;
      address: any;
      orderItems: any[];
      isPaid: any;
      createdAt: any;
    }) => ({
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems
        .map((orderitem) => orderitem.product.name)
        .join(", "),
      totalPrice: formatter.format(
        item.orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
