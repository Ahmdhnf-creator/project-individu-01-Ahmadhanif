export function groupByPeriod(orders: {total:number, createdAt:Date}[], range: "harian"|"mingguan"|"bulanan"){
  const map = new Map<string, number>();
  for(const o of orders){
    let label: string;
    if(range==="harian") label = o.createdAt.toISOString().slice(0,10);
    else if(range==="bulanan") label = o.createdAt.toISOString().slice(0,7);
    else {
      const d = new Date(o.createdAt);
      const jan1 = new Date(d.getFullYear(),0,1);
      const week = Math.ceil(((d.getTime()-jan1.getTime())/86400000 + jan1.getDay()+1)/7);
      label = `${d.getFullYear()}-W${String(week).padStart(2,"0")}`;
    }
    map.set(label, (map.get(label)||0)+o.total);
  }
  return Array.from(map.entries()).map(([label,total])=>({label,total})).sort((a,b)=>a.label.localeCompare(b.label));
}
export async function getReport(range: "harian"|"mingguan"|"bulanan", from: Date, to: Date){
  const { prisma } = await import("./prisma");
  const orders = await prisma.order.findMany({ where:{ status:"SELESAI", createdAt:{ gte:from, lte:to }}, include:{customer:true, user:true}});
  const totalOmzet = orders.reduce((a,b)=>a+b.total,0);
  const perCustomerMap = new Map<string, {name:string, wa:string, total:number, count:number}>();
  for(const o of orders){
    const key = o.customerId ?? o.userId ?? "unknown";
    const name = o.customer?.name ?? o.user?.name ?? "Unknown";
    const wa = o.customer?.wa ?? o.user?.wa ?? "-";
    const cur = perCustomerMap.get(key) ?? {name, wa, total:0, count:0};
    cur.total += o.total; cur.count += 1;
    perCustomerMap.set(key, cur);
  }
  return {
    totalOmzet,
    totalOrders: orders.length,
    perCustomer: Array.from(perCustomerMap.entries()).map(([customerId, v])=>({customerId, ...v})),
    perPeriod: groupByPeriod(orders, range),
  };
}
