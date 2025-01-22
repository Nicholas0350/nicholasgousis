export type User = {
  id: string
  email: string
  payment_id: string
  subscription_status: 'active' | 'cancelled' | 'expired'
  created_at: string
  subscription_end_date: string
}

// Add this type for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id'>
        Update: Partial<User>
      }
      afs_licensees: {
        Row: {
          REGISTER_NAME: string
          AFS_LIC_NUM: string
          AFS_LIC_NAME: string
          AFS_LIC_ABN: string
          AFS_LIC_ACN: string
          AFS_LIC_START_DT: string
          AFS_LIC_END_DT: string
          AFS_LIC_STATUS: string
          AFS_LIC_ADD_LOC: string
          AFS_LIC_ADD_STATE: string
          AFS_LIC_ADD_PCO: string
          AFS_LIC_ADD_COU: string
          AFS_LIC_PRIN_BUS: string
          AFS_LIC_SERV_NAME: string
          AFS_LIC_REMUN_TYP: string
          AFS_LIC_EXT_DIS_RES: string
        }
      }
      // Add other tables as needed
    }
  }
}