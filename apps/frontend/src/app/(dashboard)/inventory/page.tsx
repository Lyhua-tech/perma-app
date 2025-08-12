"use client";

import ItemsList from "@/components/items-list";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

async function fetchAllInventory() {
  try {
    const res = await api.get(`/api/v1/inventories`);
    // Axios response: res.data contains parsed JSON
    return res.data;
  } catch (error) {
    console.error("Fail to get inventory", error);
    throw error;
  }
}

const Page = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryFn: fetchAllInventory,
    queryKey: ["inventory"],
  });
  return (
    <div>
      <h1>Inventory</h1>
      <ItemsList values={data?.allinventories} />
    </div>
  );
};
export default Page;
