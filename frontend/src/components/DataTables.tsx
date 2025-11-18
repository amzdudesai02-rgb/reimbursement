import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Reimbursement } from '../types'


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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
       <table className="min-w-full text-sm">
           <thead className="bg-neutral-100">
              <tr>
                   <th className="text-left p-2">Date</th>
                   <th className="text-left p-2">Order</th>
                   <th className="text-left p-2">SKU</th>
                   <th className="text-left p-2">ASIN</th>
                   <th className="text-left p-2">Issue</th>
                   <th className="text-right p-2">Amount</th>
              </tr>
           </thead>
           <tbody>
              {rows.map(r => (
                 <tr key={r.id} className="border-t">
                     <td className="p-2">{r.date ?? ''}</td>
                     <td className="p-2">{r.order_id ?? ''}</td>
                     <td className="p-2">{r.sku ?? ''}</td>
                     <td className="p-2">{r.asin ?? ''}</td>
                     <td className="p-2">{r.issue_type ?? ''}</td>
                     <td className="p-2 text-right">{r.currency ?? 'USD'} {r.amount.toFixed(2)}</td>
              </tr>
           ))}
           </tbody>
       </table>
       <div className="flex justify-between p-3">
             <button className="px-3 py-1 rounded bg-neutral-200" onClick={()=>fetchPage(Math.max(0, skip - limit))} disabled={skip===0}>Prev</button>
             <button className="px-3 py-1 rounded bg-neutral-800 text-white" onClick={()=>fetchPage(skip + limit)}>Next</button>
       </div>
    </div>
   )
}