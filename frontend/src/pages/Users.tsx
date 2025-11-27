import { useMemo, useState } from 'react'
import { Pencil, Search } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  emptyStateCellClass,
} from '../styles/tableTheme'

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
            <div className={tableWrapperClass}>
              <table className={tableClass}>
                <thead className={tableHeadClass}>
                  <tr className="text-left">
                    <th className="px-6 py-4">User Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Store Access</th>
                  </tr>
                </thead>
                <tbody className={tableBodyClass}>
                  {filtered.map((user) => (
                    <tr key={user.email} className="transition hover:bg-white/5">
                      <td className={`${tableCellClass} font-semibold text-white`}>
                        <div className="flex items-center gap-3">
                          <span>{user.name}</span>
                          {user.role === 'User' && (
                            <button
                              type="button"
                              className="text-white/60 transition hover:text-teal-200"
                              aria-label={`Edit ${user.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className={tableCellClass}>{user.email}</td>
                      <td className={tableCellClass}>{user.role}</td>
                      <td className={tableCellClass}>
                        {user.storeAccess ? (
                          <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80">
                            {user.storeAccess}
                          </span>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={4} className={emptyStateCellClass}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
