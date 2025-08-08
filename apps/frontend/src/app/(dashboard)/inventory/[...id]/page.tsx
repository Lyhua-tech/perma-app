"use client";

import ProductList from "@/components/product-list";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export async function generateStaticParams() {
  // Replace this with a call to your backend to get all inventory IDs
  const inventoryIds = ["1", "2", "3"];

  return inventoryIds.map((id) => ({
    id: [id],
  }));
}

const Page = () => {
  const { id } = useParams();
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const {
    isPending,
    isError,
    error,
    data: inventory,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(`${url}/api/v1/inventory/${id}`).then((res) => res.json()),
  });
  // src/app/(dashboard)/inventory/[...id]/page.tsx

  if (isPending) return <div>...loading</div>;

  if (isError) return <div>{error.message}</div>;
  return (
    <div>
      <div className="border-b py-3 mb-5 rounded px-2 bg-white">
        <h1 className="font-bold text-neutral-600">{inventory.name}</h1>
      </div>
      <ProductList products={inventory?.products} />
    </div>
  );
};
export default Page;
