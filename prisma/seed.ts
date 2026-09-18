import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
async function main(){
  const hash = await hashPassword("123456");
  await prisma.user.upsert({ where:{email:"admin@gmail.com"}, update:{}, create:{ email:"admin@gmail.com", password: hash, name:"Admin", role:"ADMIN", wa:"08123456789"} });
}
main().then(()=>process.exit(0));
