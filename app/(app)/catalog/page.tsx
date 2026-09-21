import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage(){
  const user = await getCurrentUser();
  if(!user) redirect("/login");
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy:{ createdAt:"desc" }});
  const customers = user.role==="PELANGGAN" ? [] : await prisma.customer.findMany({ orderBy:{ name:"asc"}});
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Katalog</h1>
      <CatalogClient products={products} customers={customers} isPelanggan={user.role==="PELANGGAN"} />
    </div>
  );
}
