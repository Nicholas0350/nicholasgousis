export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: number
          primary_owner_user_id: string | null
        }
        Insert: {
          id?: never
          primary_owner_user_id?: string | null
        }
        Update: {
          id?: never
          primary_owner_user_id?: string | null
        }
        Relationships: []
      }
      afsl_licensees: {
        Row: {
          AFS_LIC_ABN_ACN: string | null
          AFS_LIC_ADD_COUNTRY: string | null
          AFS_LIC_ADD_LOCAL: string | null
          AFS_LIC_ADD_PCODE: string | null
          AFS_LIC_ADD_STATE: string | null
          AFS_LIC_CONDITION: string | null
          AFS_LIC_LAT: string | null
          AFS_LIC_LNG: string | null
          AFS_LIC_NAME: string
          AFS_LIC_NUM: string
          AFS_LIC_PRE_FSR: string | null
          AFS_LIC_START_DT: string
          created_at: string | null
          REGISTER_NAME: string
          updated_at: string | null
        }
        Insert: {
          AFS_LIC_ABN_ACN?: string | null
          AFS_LIC_ADD_COUNTRY?: string | null
          AFS_LIC_ADD_LOCAL?: string | null
          AFS_LIC_ADD_PCODE?: string | null
          AFS_LIC_ADD_STATE?: string | null
          AFS_LIC_CONDITION?: string | null
          AFS_LIC_LAT?: string | null
          AFS_LIC_LNG?: string | null
          AFS_LIC_NAME: string
          AFS_LIC_NUM: string
          AFS_LIC_PRE_FSR?: string | null
          AFS_LIC_START_DT: string
          created_at?: string | null
          REGISTER_NAME: string
          updated_at?: string | null
        }
        Update: {
          AFS_LIC_ABN_ACN?: string | null
          AFS_LIC_ADD_COUNTRY?: string | null
          AFS_LIC_ADD_LOCAL?: string | null
          AFS_LIC_ADD_PCODE?: string | null
          AFS_LIC_ADD_STATE?: string | null
          AFS_LIC_CONDITION?: string | null
          AFS_LIC_LAT?: string | null
          AFS_LIC_LNG?: string | null
          AFS_LIC_NAME?: string
          AFS_LIC_NUM?: string
          AFS_LIC_PRE_FSR?: string | null
          AFS_LIC_START_DT?: string
          created_at?: string | null
          REGISTER_NAME?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      banned_and_disqualified_persons: {
        Row: {
          BD_PER_ADD_COUNTRY: string | null
          BD_PER_ADD_LOCAL: string | null
          BD_PER_ADD_PCODE: string | null
          BD_PER_ADD_STATE: string | null
          BD_PER_COMMENTS: string | null
          BD_PER_DOC_NUM: string | null
          BD_PER_END_DT: string
          BD_PER_NAME: string
          BD_PER_START_DT: string
          BD_PER_TYPE: string
          CREATED_AT: string | null
          ID: string
          REGISTER_NAME: string
          UPDATED_AT: string | null
        }
        Insert: {
          BD_PER_ADD_COUNTRY?: string | null
          BD_PER_ADD_LOCAL?: string | null
          BD_PER_ADD_PCODE?: string | null
          BD_PER_ADD_STATE?: string | null
          BD_PER_COMMENTS?: string | null
          BD_PER_DOC_NUM?: string | null
          BD_PER_END_DT: string
          BD_PER_NAME: string
          BD_PER_START_DT: string
          BD_PER_TYPE: string
          CREATED_AT?: string | null
          ID?: string
          REGISTER_NAME: string
          UPDATED_AT?: string | null
        }
        Update: {
          BD_PER_ADD_COUNTRY?: string | null
          BD_PER_ADD_LOCAL?: string | null
          BD_PER_ADD_PCODE?: string | null
          BD_PER_ADD_STATE?: string | null
          BD_PER_COMMENTS?: string | null
          BD_PER_DOC_NUM?: string | null
          BD_PER_END_DT?: string
          BD_PER_NAME?: string
          BD_PER_START_DT?: string
          BD_PER_TYPE?: string
          CREATED_AT?: string | null
          ID?: string
          REGISTER_NAME?: string
          UPDATED_AT?: string | null
        }
        Relationships: []
      }
      credit_licensees: {
        Row: {
          CREATED_AT: string | null
          CRED_LIC_ABN_ACN: string | null
          CRED_LIC_AFSL_NUM: string | null
          CRED_LIC_AUTHORISATIONS: string | null
          CRED_LIC_BN: string | null
          CRED_LIC_EDRS: string | null
          CRED_LIC_END_DT: string | null
          CRED_LIC_LAT: string | null
          CRED_LIC_LNG: string | null
          CRED_LIC_LOCALITY: string | null
          CRED_LIC_NAME: string
          CRED_LIC_NUM: string
          CRED_LIC_PCODE: string | null
          CRED_LIC_START_DT: string | null
          CRED_LIC_STATE: string | null
          CRED_LIC_STATUS: string | null
          CRED_LIC_STATUS_HISTORY: string | null
          REGISTER_NAME: string
          UPDATED_AT: string | null
        }
        Insert: {
          CREATED_AT?: string | null
          CRED_LIC_ABN_ACN?: string | null
          CRED_LIC_AFSL_NUM?: string | null
          CRED_LIC_AUTHORISATIONS?: string | null
          CRED_LIC_BN?: string | null
          CRED_LIC_EDRS?: string | null
          CRED_LIC_END_DT?: string | null
          CRED_LIC_LAT?: string | null
          CRED_LIC_LNG?: string | null
          CRED_LIC_LOCALITY?: string | null
          CRED_LIC_NAME: string
          CRED_LIC_NUM: string
          CRED_LIC_PCODE?: string | null
          CRED_LIC_START_DT?: string | null
          CRED_LIC_STATE?: string | null
          CRED_LIC_STATUS?: string | null
          CRED_LIC_STATUS_HISTORY?: string | null
          REGISTER_NAME: string
          UPDATED_AT?: string | null
        }
        Update: {
          CREATED_AT?: string | null
          CRED_LIC_ABN_ACN?: string | null
          CRED_LIC_AFSL_NUM?: string | null
          CRED_LIC_AUTHORISATIONS?: string | null
          CRED_LIC_BN?: string | null
          CRED_LIC_EDRS?: string | null
          CRED_LIC_END_DT?: string | null
          CRED_LIC_LAT?: string | null
          CRED_LIC_LNG?: string | null
          CRED_LIC_LOCALITY?: string | null
          CRED_LIC_NAME?: string
          CRED_LIC_NUM?: string
          CRED_LIC_PCODE?: string | null
          CRED_LIC_START_DT?: string | null
          CRED_LIC_STATE?: string | null
          CRED_LIC_STATUS?: string | null
          CRED_LIC_STATUS_HISTORY?: string | null
          REGISTER_NAME?: string
          UPDATED_AT?: string | null
        }
        Relationships: []
      }
      credit_representatives: {
        Row: {
          CREATED_AT: string | null
          CRED_LIC_NUM: string
          CRED_REP_ABN_ACN: number | null
          CRED_REP_AUTHORISATIONS: string | null
          CRED_REP_CROSS_ENDORSE: string | null
          CRED_REP_EDRS: string | null
          CRED_REP_END_DT: string | null
          CRED_REP_LOCALITY: string | null
          CRED_REP_NAME: string
          CRED_REP_NUM: number
          CRED_REP_PCODE: number | null
          CRED_REP_START_DT: string
          CRED_REP_STATE: string | null
          id: string
          REGISTER_NAME: string
          UPDATED_AT: string | null
        }
        Insert: {
          CREATED_AT?: string | null
          CRED_LIC_NUM: string
          CRED_REP_ABN_ACN?: number | null
          CRED_REP_AUTHORISATIONS?: string | null
          CRED_REP_CROSS_ENDORSE?: string | null
          CRED_REP_EDRS?: string | null
          CRED_REP_END_DT?: string | null
          CRED_REP_LOCALITY?: string | null
          CRED_REP_NAME: string
          CRED_REP_NUM: number
          CRED_REP_PCODE?: number | null
          CRED_REP_START_DT: string
          CRED_REP_STATE?: string | null
          id?: string
          REGISTER_NAME: string
          UPDATED_AT?: string | null
        }
        Update: {
          CREATED_AT?: string | null
          CRED_LIC_NUM?: string
          CRED_REP_ABN_ACN?: number | null
          CRED_REP_AUTHORISATIONS?: string | null
          CRED_REP_CROSS_ENDORSE?: string | null
          CRED_REP_EDRS?: string | null
          CRED_REP_END_DT?: string | null
          CRED_REP_LOCALITY?: string | null
          CRED_REP_NAME?: string
          CRED_REP_NUM?: number
          CRED_REP_PCODE?: number | null
          CRED_REP_START_DT?: string
          CRED_REP_STATE?: string | null
          id?: string
          REGISTER_NAME?: string
          UPDATED_AT?: string | null
        }
        Relationships: []
      }
      financial_adviser_afs_reps: {
        Row: {
          ADV_NUMBER: string
          AFS_LIC_NUM: string
          AFS_REP_NUM: string
          id: number
        }
        Insert: {
          ADV_NUMBER: string
          AFS_LIC_NUM: string
          AFS_REP_NUM: string
          id?: number
        }
        Update: {
          ADV_NUMBER?: string
          AFS_LIC_NUM?: string
          AFS_REP_NUM?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "financial_adviser_afs_reps_AFS_LIC_NUM_AFS_REP_NUM_fkey"
            columns: ["AFS_LIC_NUM", "AFS_REP_NUM"]
            isOneToOne: false
            referencedRelation: "financial_services_representatives"
            referencedColumns: ["AFS_LIC_NUM", "AFS_REP_NUM"]
          },
        ]
      }
      financial_advisers: {
        Row: {
          ABLE_TO_PROVIDE_TFAS: string | null
          ADV_ABN: string | null
          ADV_ADD_COUNTRY: string | null
          ADV_ADD_LOCAL: string | null
          ADV_ADD_PCODE: string | null
          ADV_ADD_STATE: string | null
          ADV_CPD_FAILURE_YEAR: string | null
          ADV_DA_DESCRIPTION: string | null
          ADV_DA_END_DT: string | null
          ADV_DA_START_DT: string | null
          ADV_DA_TYPE: string | null
          ADV_END_DT: string | null
          ADV_FIRST_PROVIDED_ADVICE: string | null
          ADV_NAME: string
          ADV_NUMBER: string
          ADV_ROLE: string
          ADV_ROLE_STATUS: string
          ADV_START_DT: string
          ADV_SUB_TYPE: string | null
          CLASSES_LIFEPROD_LIFERISK: string | null
          CLASSES_SECUR: string | null
          CLASSES_SMIS: string | null
          CLASSES_SUPER: string | null
          CREATED_AT: string | null
          FIN: string | null
          FIN_AUSCARBCRDUNIT: string | null
          FIN_CARBUNIT: string | null
          FIN_DEPPAY_DPNONBAS: string | null
          FIN_DEPPAY_DPNONCSH: string | null
          FIN_DERIV: string | null
          FIN_DERIV_DERELEC: string | null
          FIN_DERIV_DERGRAIN: string | null
          FIN_DERIV_DERWOOL: string | null
          FIN_ELIGINTREMSUNIT: string | null
          FIN_FHSANONADIDUMMY: string | null
          FIN_FOREXCH: string | null
          FIN_GOVDEB: string | null
          FIN_LIFEPROD_LIFEINV: string | null
          FIN_LIFEPROD_LIFERISK: string | null
          FIN_LIFEPROD_LIFERISK_LIFECONS: string | null
          FIN_MINV_IMIS: string | null
          FIN_MINV_MIEXCLUDEIDPS: string | null
          FIN_MINV_MIHORSE: string | null
          FIN_MINV_MIIDPSONLY: string | null
          FIN_MINV_MIINCLUDEIDPS: string | null
          FIN_MINV_MIOWN: string | null
          FIN_MINV_MITIME: string | null
          FIN_MISFIN_MISFINIP: string | null
          FIN_MISFIN_MISFINRP: string | null
          FIN_MISFIN_MISMDA: string | null
          FIN_NONSTDMARGLEND: string | null
          FIN_RSA: string | null
          FIN_SECUR: string | null
          FIN_STDMARGLEND: string | null
          FIN_SUPER: string | null
          FIN_SUPER_SMSUPER: string | null
          FIN_SUPER_SUPERHOLD: string | null
          FURTHER_RESTRICTIONS: string | null
          LICENCE_ABN: string | null
          LICENCE_CONTROLLED_BY: string | null
          LICENCE_NAME: string
          LICENCE_NUMBER: string
          MEMBERSHIPS: string | null
          OVERALL_REGISTRATION_STATUS: string | null
          QUALIFICATIONS_AND_TRAINING: string | null
          REGISTER_NAME: string
          REGISTRATION_END_DATE_UNDER_AFSL: string | null
          REGISTRATION_START_DATE_UNDER_AFSL: string | null
          REGISTRATION_STATUS_UNDER_AFSL: string | null
          REP_APPOINTED_ABN: string | null
          REP_APPOINTED_BY: string | null
          REP_APPOINTED_NUM: string | null
          UPDATED_AT: string | null
        }
        Insert: {
          ABLE_TO_PROVIDE_TFAS?: string | null
          ADV_ABN?: string | null
          ADV_ADD_COUNTRY?: string | null
          ADV_ADD_LOCAL?: string | null
          ADV_ADD_PCODE?: string | null
          ADV_ADD_STATE?: string | null
          ADV_CPD_FAILURE_YEAR?: string | null
          ADV_DA_DESCRIPTION?: string | null
          ADV_DA_END_DT?: string | null
          ADV_DA_START_DT?: string | null
          ADV_DA_TYPE?: string | null
          ADV_END_DT?: string | null
          ADV_FIRST_PROVIDED_ADVICE?: string | null
          ADV_NAME: string
          ADV_NUMBER: string
          ADV_ROLE: string
          ADV_ROLE_STATUS: string
          ADV_START_DT: string
          ADV_SUB_TYPE?: string | null
          CLASSES_LIFEPROD_LIFERISK?: string | null
          CLASSES_SECUR?: string | null
          CLASSES_SMIS?: string | null
          CLASSES_SUPER?: string | null
          CREATED_AT?: string | null
          FIN?: string | null
          FIN_AUSCARBCRDUNIT?: string | null
          FIN_CARBUNIT?: string | null
          FIN_DEPPAY_DPNONBAS?: string | null
          FIN_DEPPAY_DPNONCSH?: string | null
          FIN_DERIV?: string | null
          FIN_DERIV_DERELEC?: string | null
          FIN_DERIV_DERGRAIN?: string | null
          FIN_DERIV_DERWOOL?: string | null
          FIN_ELIGINTREMSUNIT?: string | null
          FIN_FHSANONADIDUMMY?: string | null
          FIN_FOREXCH?: string | null
          FIN_GOVDEB?: string | null
          FIN_LIFEPROD_LIFEINV?: string | null
          FIN_LIFEPROD_LIFERISK?: string | null
          FIN_LIFEPROD_LIFERISK_LIFECONS?: string | null
          FIN_MINV_IMIS?: string | null
          FIN_MINV_MIEXCLUDEIDPS?: string | null
          FIN_MINV_MIHORSE?: string | null
          FIN_MINV_MIIDPSONLY?: string | null
          FIN_MINV_MIINCLUDEIDPS?: string | null
          FIN_MINV_MIOWN?: string | null
          FIN_MINV_MITIME?: string | null
          FIN_MISFIN_MISFINIP?: string | null
          FIN_MISFIN_MISFINRP?: string | null
          FIN_MISFIN_MISMDA?: string | null
          FIN_NONSTDMARGLEND?: string | null
          FIN_RSA?: string | null
          FIN_SECUR?: string | null
          FIN_STDMARGLEND?: string | null
          FIN_SUPER?: string | null
          FIN_SUPER_SMSUPER?: string | null
          FIN_SUPER_SUPERHOLD?: string | null
          FURTHER_RESTRICTIONS?: string | null
          LICENCE_ABN?: string | null
          LICENCE_CONTROLLED_BY?: string | null
          LICENCE_NAME: string
          LICENCE_NUMBER: string
          MEMBERSHIPS?: string | null
          OVERALL_REGISTRATION_STATUS?: string | null
          QUALIFICATIONS_AND_TRAINING?: string | null
          REGISTER_NAME: string
          REGISTRATION_END_DATE_UNDER_AFSL?: string | null
          REGISTRATION_START_DATE_UNDER_AFSL?: string | null
          REGISTRATION_STATUS_UNDER_AFSL?: string | null
          REP_APPOINTED_ABN?: string | null
          REP_APPOINTED_BY?: string | null
          REP_APPOINTED_NUM?: string | null
          UPDATED_AT?: string | null
        }
        Update: {
          ABLE_TO_PROVIDE_TFAS?: string | null
          ADV_ABN?: string | null
          ADV_ADD_COUNTRY?: string | null
          ADV_ADD_LOCAL?: string | null
          ADV_ADD_PCODE?: string | null
          ADV_ADD_STATE?: string | null
          ADV_CPD_FAILURE_YEAR?: string | null
          ADV_DA_DESCRIPTION?: string | null
          ADV_DA_END_DT?: string | null
          ADV_DA_START_DT?: string | null
          ADV_DA_TYPE?: string | null
          ADV_END_DT?: string | null
          ADV_FIRST_PROVIDED_ADVICE?: string | null
          ADV_NAME?: string
          ADV_NUMBER?: string
          ADV_ROLE?: string
          ADV_ROLE_STATUS?: string
          ADV_START_DT?: string
          ADV_SUB_TYPE?: string | null
          CLASSES_LIFEPROD_LIFERISK?: string | null
          CLASSES_SECUR?: string | null
          CLASSES_SMIS?: string | null
          CLASSES_SUPER?: string | null
          CREATED_AT?: string | null
          FIN?: string | null
          FIN_AUSCARBCRDUNIT?: string | null
          FIN_CARBUNIT?: string | null
          FIN_DEPPAY_DPNONBAS?: string | null
          FIN_DEPPAY_DPNONCSH?: string | null
          FIN_DERIV?: string | null
          FIN_DERIV_DERELEC?: string | null
          FIN_DERIV_DERGRAIN?: string | null
          FIN_DERIV_DERWOOL?: string | null
          FIN_ELIGINTREMSUNIT?: string | null
          FIN_FHSANONADIDUMMY?: string | null
          FIN_FOREXCH?: string | null
          FIN_GOVDEB?: string | null
          FIN_LIFEPROD_LIFEINV?: string | null
          FIN_LIFEPROD_LIFERISK?: string | null
          FIN_LIFEPROD_LIFERISK_LIFECONS?: string | null
          FIN_MINV_IMIS?: string | null
          FIN_MINV_MIEXCLUDEIDPS?: string | null
          FIN_MINV_MIHORSE?: string | null
          FIN_MINV_MIIDPSONLY?: string | null
          FIN_MINV_MIINCLUDEIDPS?: string | null
          FIN_MINV_MIOWN?: string | null
          FIN_MINV_MITIME?: string | null
          FIN_MISFIN_MISFINIP?: string | null
          FIN_MISFIN_MISFINRP?: string | null
          FIN_MISFIN_MISMDA?: string | null
          FIN_NONSTDMARGLEND?: string | null
          FIN_RSA?: string | null
          FIN_SECUR?: string | null
          FIN_STDMARGLEND?: string | null
          FIN_SUPER?: string | null
          FIN_SUPER_SMSUPER?: string | null
          FIN_SUPER_SUPERHOLD?: string | null
          FURTHER_RESTRICTIONS?: string | null
          LICENCE_ABN?: string | null
          LICENCE_CONTROLLED_BY?: string | null
          LICENCE_NAME?: string
          LICENCE_NUMBER?: string
          MEMBERSHIPS?: string | null
          OVERALL_REGISTRATION_STATUS?: string | null
          QUALIFICATIONS_AND_TRAINING?: string | null
          REGISTER_NAME?: string
          REGISTRATION_END_DATE_UNDER_AFSL?: string | null
          REGISTRATION_START_DATE_UNDER_AFSL?: string | null
          REGISTRATION_STATUS_UNDER_AFSL?: string | null
          REP_APPOINTED_ABN?: string | null
          REP_APPOINTED_BY?: string | null
          REP_APPOINTED_NUM?: string | null
          UPDATED_AT?: string | null
        }
        Relationships: []
      }
      financial_services_representatives: {
        Row: {
          AFS_LIC_NUM: string | null
          AFS_REP_ABN: string | null
          AFS_REP_ACN: string | null
          AFS_REP_ADD_COUNTRY: string | null
          AFS_REP_ADD_LOCAL: string | null
          AFS_REP_ADD_PCODE: string | null
          AFS_REP_ADD_STATE: string | null
          AFS_REP_APPOINTED_BY: string | null
          AFS_REP_CROSS_ENDORSE: string | null
          AFS_REP_END_DT: string | null
          AFS_REP_MAY_APPOINT: string | null
          AFS_REP_NAME: string | null
          AFS_REP_NUM: string
          AFS_REP_OTHER_ROLE: string | null
          AFS_REP_RELATED_BN: string | null
          AFS_REP_SAME_AUTH: string | null
          AFS_REP_START_DT: string | null
          AFS_REP_STATUS: string | null
          APPLY: string | null
          ARRANGE: string | null
          ARRANGE_APPLY: string | null
          ARRANGE_ISSUE: string | null
          ARRANGE_UNDERWR: string | null
          CLASSES: string | null
          DEAL: string | null
          DEAL_APPLY: string | null
          DEAL_ISSUE: string | null
          DEAL_UNDERWR: string | null
          FIN: string | null
          GENFIN: string | null
          ID: number
          IDPS: string | null
          ISSUE: string | null
          MARKET: string | null
          NONIDPS: string | null
          REGISTER_NAME: string | null
          SCHEME: string | null
          TRUSTEE: string | null
          UNDERWR: string | null
          WSALE: string | null
        }
        Insert: {
          AFS_LIC_NUM?: string | null
          AFS_REP_ABN?: string | null
          AFS_REP_ACN?: string | null
          AFS_REP_ADD_COUNTRY?: string | null
          AFS_REP_ADD_LOCAL?: string | null
          AFS_REP_ADD_PCODE?: string | null
          AFS_REP_ADD_STATE?: string | null
          AFS_REP_APPOINTED_BY?: string | null
          AFS_REP_CROSS_ENDORSE?: string | null
          AFS_REP_END_DT?: string | null
          AFS_REP_MAY_APPOINT?: string | null
          AFS_REP_NAME?: string | null
          AFS_REP_NUM: string
          AFS_REP_OTHER_ROLE?: string | null
          AFS_REP_RELATED_BN?: string | null
          AFS_REP_SAME_AUTH?: string | null
          AFS_REP_START_DT?: string | null
          AFS_REP_STATUS?: string | null
          APPLY?: string | null
          ARRANGE?: string | null
          ARRANGE_APPLY?: string | null
          ARRANGE_ISSUE?: string | null
          ARRANGE_UNDERWR?: string | null
          CLASSES?: string | null
          DEAL?: string | null
          DEAL_APPLY?: string | null
          DEAL_ISSUE?: string | null
          DEAL_UNDERWR?: string | null
          FIN?: string | null
          GENFIN?: string | null
          ID?: number
          IDPS?: string | null
          ISSUE?: string | null
          MARKET?: string | null
          NONIDPS?: string | null
          REGISTER_NAME?: string | null
          SCHEME?: string | null
          TRUSTEE?: string | null
          UNDERWR?: string | null
          WSALE?: string | null
        }
        Update: {
          AFS_LIC_NUM?: string | null
          AFS_REP_ABN?: string | null
          AFS_REP_ACN?: string | null
          AFS_REP_ADD_COUNTRY?: string | null
          AFS_REP_ADD_LOCAL?: string | null
          AFS_REP_ADD_PCODE?: string | null
          AFS_REP_ADD_STATE?: string | null
          AFS_REP_APPOINTED_BY?: string | null
          AFS_REP_CROSS_ENDORSE?: string | null
          AFS_REP_END_DT?: string | null
          AFS_REP_MAY_APPOINT?: string | null
          AFS_REP_NAME?: string | null
          AFS_REP_NUM?: string
          AFS_REP_OTHER_ROLE?: string | null
          AFS_REP_RELATED_BN?: string | null
          AFS_REP_SAME_AUTH?: string | null
          AFS_REP_START_DT?: string | null
          AFS_REP_STATUS?: string | null
          APPLY?: string | null
          ARRANGE?: string | null
          ARRANGE_APPLY?: string | null
          ARRANGE_ISSUE?: string | null
          ARRANGE_UNDERWR?: string | null
          CLASSES?: string | null
          DEAL?: string | null
          DEAL_APPLY?: string | null
          DEAL_ISSUE?: string | null
          DEAL_UNDERWR?: string | null
          FIN?: string | null
          GENFIN?: string | null
          ID?: number
          IDPS?: string | null
          ISSUE?: string | null
          MARKET?: string | null
          NONIDPS?: string | null
          REGISTER_NAME?: string | null
          SCHEME?: string | null
          TRUSTEE?: string | null
          UNDERWR?: string | null
          WSALE?: string | null
        }
        Relationships: []
      }
      function_logs: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          function_name: string
          id: string
          records_processed: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          function_name: string
          id?: string
          records_processed?: number | null
          status: string
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          function_name?: string
          id?: string
          records_processed?: number | null
          status?: string
        }
        Relationships: []
      }
      representative_relationships: {
        Row: {
          ADVISER_NUMBER: string | null
          AFS_LIC_NUM: string
          AFS_REP_NUM: string
          CREATED_AT: string | null
          ID: string
          REP_ID: number
          UPDATED_AT: string | null
        }
        Insert: {
          ADVISER_NUMBER?: string | null
          AFS_LIC_NUM: string
          AFS_REP_NUM: string
          CREATED_AT?: string | null
          ID?: string
          REP_ID: number
          UPDATED_AT?: string | null
        }
        Update: {
          ADVISER_NUMBER?: string | null
          AFS_LIC_NUM?: string
          AFS_REP_NUM?: string
          CREATED_AT?: string | null
          ID?: string
          REP_ID?: number
          UPDATED_AT?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "representative_relationships_ADVISER_NUMBER_fkey"
            columns: ["ADVISER_NUMBER"]
            isOneToOne: false
            referencedRelation: "financial_advisers"
            referencedColumns: ["ADV_NUMBER"]
          },
          {
            foreignKeyName: "representative_relationships_REP_ID_fkey"
            columns: ["REP_ID"]
            isOneToOne: false
            referencedRelation: "financial_services_representatives"
            referencedColumns: ["ID"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          email: string | null
          id: number
          password: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          email?: string | null
          id?: number
          password?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          password?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      create_account: {
        Args: {
          slug?: string
          name?: string
        }
        Returns: Json
      }
      create_invitation: {
        Args: {
          account_id: string
          account_role: "owner" | "member"
          invitation_type: "one_time" | "24_hour"
        }
        Returns: Json
      }
      current_user_account_role: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      delete_invitation: {
        Args: {
          invitation_id: string
        }
        Returns: undefined
      }
      get_account: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      get_account_billing_status: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      get_account_by_slug: {
        Args: {
          slug: string
        }
        Returns: Json
      }
      get_account_id: {
        Args: {
          slug: string
        }
        Returns: string
      }
      get_account_invitations: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_account_members: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_personal_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      lookup_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      populate_financial_adviser_afs_representative: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      remove_account_member: {
        Args: {
          account_id: string
          user_id: string
        }
        Returns: undefined
      }
      service_role_upsert_customer_subscription: {
        Args: {
          account_id: string
          customer?: Json
          subscription?: Json
        }
        Returns: undefined
      }
      update_account: {
        Args: {
          account_id: string
          slug?: string
          name?: string
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: Json
      }
      update_account_user_role: {
        Args: {
          account_id: string
          user_id: string
          new_account_role: "owner" | "member"
          make_primary_owner?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
