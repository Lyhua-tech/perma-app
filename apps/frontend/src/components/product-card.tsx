import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Package, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";

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

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 m-0 rounded">
      <CardHeader className="pb-4">
        <div className="relative w-full h-52 mb-4">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            width={400}
            height={256}
            alt={product.name}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 text-left">
          {product.name}
        </CardTitle>
        {/* <CardDescription className="text-gray-600 mt-2 text-left">
          Monitor your product details and availability. Stay informed about
          stock levels and pricing updates.
        </CardDescription> */}
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package className="w-4 h-4" />
          <span>SKU: {product.sku}</span>
        </div>

        <div className="flex items-center gap-4 justify-between">
          <div className="text-xl font-bold text-gray-900">
            $ {product.price}
          </div>
          <Badge variant="secondary" className="py-1">
            Qty: {product.quantity}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-0 pt-4">
        <Button className="w-full border border-neutral-300" size="lg" variant={"ghost"}>
          View Details
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            Updated: {new Date(product.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
