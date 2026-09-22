import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), wa: z.string().min(8), address: z.string().optional() });
export const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["ADMIN","STAFF","PELANGGAN"]), wa: z.string().optional(), address: z.string().optional() });
export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().int().min(0),
  unit: z.string().min(1).default("pcs"),
  type: z.enum(["BARANG", "JASA", "SEWA"]).default("BARANG"),
  trackStock: z.coerce.boolean().default(true),
  stock: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
}).refine((d) => (d.trackStock ? true : true), { message: "invalid" });
export const customerSchema = z.object({ name: z.string().min(2), wa: z.string().min(8), address: z.string().optional() });
export const createOrderSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.enum(["TRANSFER", "COD", "TUNAI", "QRIS"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.coerce.number().int().min(1),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .min(1),
  note: z.string().optional(),
});
export const updateStatusSchema = z.object({ status: z.enum(["BARU","DIPROSES","DIKIRIM","SELESAI","BATAL"]) });
