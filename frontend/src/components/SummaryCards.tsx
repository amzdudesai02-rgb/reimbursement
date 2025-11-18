import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Summary } from '../types'


export default function SummaryCards() {
   const [summary, setSummary] = useState<Summary | null>(null)


   async function fetchSummary(){
   const { data } = await api.get<Summary>('/summary')
   setSummary(data)
}


useEffect(()=>{ fetchSummary() }, [])


return (
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="text-sm text-neutral-500">Total Reimbursed</div>
        <div className="text-2xl font-semibold">{summary ? `${summary.currency} ${summary.total_amount.toFixed(2)}` : '—'}</div>
   </div>
   <div className="p-4 bg-white rounded-2xl shadow-sm">
      <div className="text-sm text-neutral-500">Rows</div>
      <div className="text-2xl font-semibold">{summary ? summary.row_count : '—'}</div>
   </div>
   <div className="p-4 bg-white rounded-2xl shadow-sm">
      <div className="text-sm text-neutral-500">Last Upload</div>
      <div className="text-2xl font-semibold">Auto</div>
   </div>
  </div>
  )
}