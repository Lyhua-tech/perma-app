"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {values?.map((item: Item, index: number) => {
        return (
          <Link key={index} href={`/inventory/${item.id}`} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-neutral-50 to-purple-50 dark:from-neutral-950/20 dark:to-purple-950/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-neutral-100  dark:text-neutral-300 text-xs"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      ID: {item.id}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-neutral-600 dark:group-hover:text--400 transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full "></div>
                    <span>Managed by {item.ownerName || "hua hua"}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last updated</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ItemsList;
