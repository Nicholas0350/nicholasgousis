export interface BatchConfig {
  batchSize: number
  concurrency: number
  retryAttempts: number
  timeoutMs: number
}

export interface ASICResponse {
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