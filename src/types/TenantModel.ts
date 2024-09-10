export interface UpdateTenant {
  tenant_name?: string;
  tenant_type?: string;
  board_id?: number[];
  status?: string;
  is_active?: boolean;
  created_by?: number;
  updated_by?: number;
}
