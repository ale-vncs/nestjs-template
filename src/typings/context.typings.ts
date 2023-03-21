const context = ['api', 'scheduler'] as const

export type AppContextType = (typeof context)[number]

export interface ContextKeys {
  req: {
    method: string
    host: string
    originalUrl: string
  }
  logger: {
    transactionId: string
    context: AppContextType
  }
}
