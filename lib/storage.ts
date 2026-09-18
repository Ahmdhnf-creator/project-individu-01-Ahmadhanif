import { writeFile, mkdir } from "fs/promises";
import path from "path";
export async function saveFile(file: File){
  const bytes = await file.arrayBuffer();
  const ext = path.extname(file.name);
  const name = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public/uploads");
  await mkdir(dir, { recursive:true });
  await writeFile(path.join(dir, name), Buffer.from(bytes));
  return `/uploads/${name}`;
}
export function getUrl(p: string){ return p; }
export function validateFile(file: File){
  if(!["image/jpeg","image/png","application/pdf"].includes(file.type)) throw new Error("Tipe file harus jpg/png/pdf");
  if(file.size > 5*1024*1024) throw new Error("Maks 5MB");
}
