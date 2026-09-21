export type OrderStatus = "BARU"|"DIPROSES"|"DIKIRIM"|"SELESAI"|"BATAL";
// DIKIRIM opsional: DIPROSES bisa langsung SELESAI (jasa) atau via DIKIRIM (barang)
const transitions: Record<OrderStatus, OrderStatus[]> = { BARU:["DIPROSES","BATAL"], DIPROSES:["DIKIRIM","SELESAI","BATAL"], DIKIRIM:["SELESAI","BATAL"], SELESAI:[], BATAL:[] };
export function canTransition(from: OrderStatus, to: OrderStatus){ return transitions[from].includes(to); }
export function getNextStatuses(s: OrderStatus){ return transitions[s]; }
export function calculateTotal(items: {price:number, qty:number}[]){ return items.reduce((a,b)=>a+b.price*b.qty,0); }
