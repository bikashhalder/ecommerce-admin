"use client";
import React from "react";
import { SWRConfig } from "swr";
const SwrProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}>
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
