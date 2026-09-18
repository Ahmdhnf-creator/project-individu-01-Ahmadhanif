import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), wa: z.string().min(8), address: z.string().optional() });
export const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["ADMIN","STAFF","PELANGGAN"]), wa: z.string().optional(), address: z.string().optional() });
export const productSchema = z.object({ name: z.string().min(2), price: z.coerce.number().int().min(0), stock: z.coerce.number().int().min(0) });
export const customerSchema = z.object({ name: z.string().min(2), wa: z.string().min(8), address: z.string().optional() });
