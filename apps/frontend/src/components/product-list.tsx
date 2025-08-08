import Link from "next/link";
import ProductCard from "./product-card";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="">
      <ul className="grid xl:grid-cols-4 gap-3 lg:grid-cols-3 md:grid-cols-2">
        {products?.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProductList;
