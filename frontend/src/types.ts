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
   store_id?: number
   order_id?: string
   sku?: string
   asin?: string
   issue_type?: string
   amount: number
   currency?: string
   date?: string
   notes?: string

  // Raw Amazon reimbursement fields for CSV export
  approval_date?: string
  reimbursement_id?: string
  case_id?: string
  amazon_order_id?: string
  reason?: string
  fnsku?: string
  product_name?: string
  condition?: string
  currency_unit?: string
  amount_per_unit?: number
  amount_total?: number
  quantity_reimbursed_cash?: number
  quantity_reimbursed_inventory?: number
  quantity_reimbursed_total?: number
  original_reimbursement_id?: string
  original_reimbursement_type?: string
}

export type ShipmentQueueRow = {
  id: number
  store_id?: number
  shipment_id?: string
  reference_id?: string
  shipment_name?: string
  created_at?: string
  updated_at?: string
  ship_to?: string
  sku_count?: number
  expected_units?: number
  status?: string
}