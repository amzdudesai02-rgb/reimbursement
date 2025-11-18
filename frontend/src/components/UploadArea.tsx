import { useState } from 'react'
import { api } from '../lib/api'
import type { UploadReport } from '../types'


export default function UploadArea({ onDone }: { onDone: (r: UploadReport)=>void }) {
   const [busy, setBusy] = useState(false)
   const [error, setError] = useState<string | null>(null)


   async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
     if (!e.target.files || e.target.files.length === 0) return
     const file = e.target.files[0]
     const form = new FormData()
     form.append('file', file)
     setBusy(true); setError(null)
     try {
       const { data } = await api.post<UploadReport>('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
       onDone(data)
     } catch (err: any) {
       setError(err?.response?.data?.detail ?? 'Upload failed')
     } finally { setBusy(false) }
}


return (
   <div className="p-4 border-2 border-dashed rounded-2xl bg-white shadow-sm">
     <p className="text-sm mb-2">Upload your Amazon reimbursement CSV/TSV</p>
     <input type="file" accept=".csv,.tsv" onChange={onFileChange} disabled={busy} />
     {busy && <p className="text-xs mt-2">Processing…</p>}
     {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
   </div>
 )
}