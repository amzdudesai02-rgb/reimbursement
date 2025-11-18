export type UploadReport = {
   total_rows: number
   inserted_rows: number
   skipped_rows: number
   errors: string[]
}


export type Summary = {
   total_amount: number
   currency: string
   row_count: number
}


export type Reimbursement = {
   id: number
   order_id?: string
   sku?: string
   asin?: string
   issue_type?: string
   amount: number
   currency?: string
   date?: string
   notes?: string
}