export type OrderStatus = "BARU"|"DIPROSES"|"DIKIRIM"|"SELESAI"|"BATAL";
// DIKIRIM opsional: DIPROSES bisa langsung SELESAI (jasa) atau via DIKIRIM (barang)
const transitions: Record<OrderStatus, OrderStatus[]> = { BARU:["DIPROSES","BATAL"], DIPROSES:["DIKIRIM","SELESAI","BATAL"], DIKIRIM:["SELESAI","BATAL"], SELESAI:[], BATAL:[] };
export function canTransition(from: OrderStatus, to: OrderStatus){ return transitions[from].includes(to); }
export function getNextStatuses(s: OrderStatus){ return transitions[s]; }
export function calculateTotal(items: {price:number, qty:number}[]){ return items.reduce((a,b)=>a+b.price*b.qty,0); }

// Rental: hitung durasi inclusive aman timezone (YYYY-MM-DD -> local noon)
export function getRentalDaysInclusive(start: string | Date, end: string | Date): number {
  const toLocalNoon = (v: string | Date) => {
    if (v instanceof Date) {
      const d = new Date(v);
      d.setHours(12, 0, 0, 0);
      return d;
    }
    const [y, m, d] = String(v).split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
  };
  const s = toLocalNoon(start);
  const e = toLocalNoon(end);
  const diff = e.getTime() - s.getTime();
  const days = Math.floor(diff / 86400000) + 1;
  return Math.max(1, days);
}

export function calcRentalSubtotal(pricePerDay: number, start: string | Date, end: string | Date): number {
  return pricePerDay * getRentalDaysInclusive(start, end);
}
