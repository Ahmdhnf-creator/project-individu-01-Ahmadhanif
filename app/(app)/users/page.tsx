import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { createUser, updateUser, deleteUser } from "./actions";

export default async function UsersPage(){
  await requireRole("ADMIN");
  const users = await prisma.user.findMany({ orderBy:{ createdAt:"desc"}});
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <details className="rounded border p-4">
        <summary className="cursor-pointer font-medium">Tambah User</summary>
        <form action={createUser} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" placeholder="Name" className="rounded border px-2 py-1" required />
          <input name="email" placeholder="Email" type="email" className="rounded border px-2 py-1" required />
          <input name="password" placeholder="Password" type="password" className="rounded border px-2 py-1" required />
          <select name="role" className="rounded border px-2 py-1"><option value="ADMIN">ADMIN</option><option value="STAFF">STAFF</option><option value="PELANGGAN">PELANGGAN</option></select>
          <input name="wa" placeholder="WA" className="rounded border px-2 py-1" />
          <input name="address" placeholder="Address" className="rounded border px-2 py-1" />
          <button type="submit" className="col-span-2 rounded bg-black px-3 py-1.5 text-white">Create</button>
        </form>
      </details>
      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Role</th><th className="p-2 text-left">WA</th><th className="p-2 text-right">Aksi</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.wa ?? "-"}</td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-2">
                    <details className="relative"><summary className="cursor-pointer rounded border px-2 py-1">Edit</summary>
                      <form action={updateUser.bind(null, u.id)} className="absolute right-0 z-10 mt-1 grid w-64 gap-2 rounded border bg-white p-3 shadow">
                        <input name="name" defaultValue={u.name} className="rounded border px-2 py-1" />
                        <input name="email" defaultValue={u.email} className="rounded border px-2 py-1" />
                        <input name="password" placeholder="Password baru (kosongkan jika tidak ganti)" type="password" className="rounded border px-2 py-1" />
                        <select name="role" defaultValue={u.role} className="rounded border px-2 py-1"><option value="ADMIN">ADMIN</option><option value="STAFF">STAFF</option><option value="PELANGGAN">PELANGGAN</option></select>
                        <input name="wa" defaultValue={u.wa ?? ""} className="rounded border px-2 py-1" />
                        <input name="address" defaultValue={u.address ?? ""} className="rounded border px-2 py-1" />
                        <button type="submit" className="rounded bg-black px-3 py-1 text-white">Simpan</button>
                      </form>
                    </details>
                    <form action={deleteUser.bind(null, u.id)}><button type="submit" className="rounded border px-2 py-1 text-red-600">Hapus</button></form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
