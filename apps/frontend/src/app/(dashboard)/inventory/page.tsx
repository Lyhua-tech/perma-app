"use client";

import ItemsList from "@/components/items-list";
import { useQuery } from "@tanstack/react-query";

async function fetchAllInventory() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${url}/api/v1/inventories`);

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
