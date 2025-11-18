import DataTable from '../components/DataTables'
import SummaryCards from '../components/SummaryCards'


export default function Dashboard(){
   return (
     <div className="space-y-8">
       <section className="rounded-3xl p-8 text-white shadow" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>
          <h2 className="text-2xl font-semibold">Your Reimbursements</h2>
          <p className="opacity-90">Secure data fetched via API after login.</p>
       </section>
       <SummaryCards/>
       <DataTable/>
      </div>
  )
}