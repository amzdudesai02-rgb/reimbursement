import { useMemo, useState } from 'react'
import { Pencil, Search } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

type Role = 'Admin' | 'User'

interface UserRecord {
  name: string
  email: string
  role: Role
  storeAccess?: string
}

const rows: UserRecord[] = [
  {
    name: 'Rhea Anadeo',
    email: 'rheaanadeo.professional@gmail.com',
    role: 'Admin',
    storeAccess: "Cowell's Beach N' Bikini",
  },
  {
    name: 'Harline Ledesma',
    email: 'harlinegayledesma@yahoo.com',
    role: 'User',
    storeAccess: undefined,
  },
  {
    name: 'Munaam Durrani',
    email: 'projectmanager682@gmail.com',
    role: 'User',
    storeAccess: "Cowell's Beach N' Bikini",
  },
]

export default function Users() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.storeAccess?.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-600">Users</p>
          <h1 className="text-3xl font-semibold text-slate-900">User Roles &amp; Permissions</h1>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">Users</p>
              <p className="text-sm text-slate-500">Manage roles and store access</p>
            </div>
            <label className="flex w-full max-w-xs items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-inner">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user name or email"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Store Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.email}>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <span>{user.name}</span>
                        {user.role === 'User' && (
                          <button
                            type="button"
                            className="text-slate-400 transition hover:text-teal-600"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.role}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.storeAccess ? (
                        <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                          {user.storeAccess}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
