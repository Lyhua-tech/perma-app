"use client";

import ItemsList from "@/components/items-list";
import { useQuery } from "@tanstack/react-query";

async function fetchAllInventory() {
  try {
    const res = await fetch("http://localhost:3333/api/v1/inventories");

    if (!res.ok) {
      throw console.error("Fail to get inventory");
    }
    return res.json();
  } catch (error) {}
}

const Page = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryFn: fetchAllInventory,
    queryKey: ["inventory"],
  });
  return (
    <div>
      <h1>Inventory</h1>
      <ItemsList values={data?.allInventories} />
    </div>
  );
};
export default Page;
