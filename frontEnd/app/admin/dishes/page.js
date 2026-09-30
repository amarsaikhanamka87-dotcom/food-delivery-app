"use client";

import { DishesCategory } from "@/app/_components/dishesCategory";
import { AddFood } from "@/app/_components/addFood";
import { PostFood } from "@/app/admin/_components/postFood";

export default function Page() {
  return (
    <div>
      <DishesCategory />

      <AddFood />
    </div>
  );
}
