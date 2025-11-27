import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Reimbursement } from '../types'
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  tableFooterClass,
  emptyStateCellClass,
} from '../styles/tableTheme'


export default function DataTable(){
    const [rows, setRows] = useState<Reimbursement[]>([])
    const [skip, setSkip] = useState(0)
    const limit = 50


async function fetchPage(s: number){
    const { data } = await api.get<Reimbursement[]>(`/reimbursements?skip=${s}&limit=${limit}`)
    setRows(data)
    setSkip(s)
}


useEffect(()=>{ fetchPage(0) }, [])


return (
    <div className={tableWrapperClass}>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead className={tableHeadClass}>
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">ASIN</th>
              <th className="px-4 py-2 text-left">Issue</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className={tableBodyClass}>
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-white/5">
                  <td className={tableCellClass}>{r.date ?? ''}</td>
                  <td className={tableCellClass}>{r.order_id ?? ''}</td>
                  <td className={tableCellClass}>{r.sku ?? ''}</td>
                  <td className={tableCellClass}>{r.asin ?? ''}</td>
                  <td className={tableCellClass}>{r.issue_type ?? ''}</td>
                  <td className={`${tableCellClass} text-right font-semibold`}>
                    {r.currency ?? 'USD'} {r.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={emptyStateCellClass}>
                  No reimbursements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={`${tableFooterClass} flex items-center justify-between`}>
        <button
          className="rounded border border-white/20 px-3 py-1 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => fetchPage(Math.max(0, skip - limit))}
          disabled={skip === 0}
        >
          Prev
        </button>
        <button
          className="rounded border border-white/20 px-3 py-1 text-sm font-semibold text-white hover:bg-white/10"
          onClick={() => fetchPage(skip + limit)}
        >
          Next
        </button>
      </div>
    </div>
  )
}