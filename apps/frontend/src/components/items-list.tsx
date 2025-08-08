"use client";

import Link from "next/link";

interface Item {
  id: string | number;
  name: string;
  ownerName?: string;
}

interface Props {
  values: Item[];
}

const ItemsList = ({ values }: Props) => {
  return (
    <>
      <ul>
        {values?.map((item: Item, index: number) => {
          return (
            <li key={index}>
              <Link href={`/inventory/${item.id}`}>
                <div className="flex bg-emerald-500 p-5 gap-5 m-3 justify-between">
                  <h1>{item.name}</h1>
                  <h2>Manage by: {item.ownerName || "hua hua"}</h2>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default ItemsList;
