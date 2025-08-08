"use client";

import ProductList from "@/components/product-list";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const {
    isPending,
    isError,
    error,
    data: inventory,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(`http://localhost:3333/api/v1/inventory/${id}`).then((res) =>
        res.json()
      ),
  });

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
