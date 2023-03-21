import { Injectable, Scope } from '@nestjs/common'
import * as winston from 'winston'
import { ContextUtil } from '@modules/context/context.util'
import { format } from 'date-fns'
import { NullOrUndefined } from '@typings/generic.typing'
import { LoggerAbstract } from './logger.abstract'
import { ContextKeys } from '@typings/context.typings'

const { combine, timestamp, printf, colorize } = winston.format

const colors = {
  trace: 'magenta',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  debug: 'blue',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  error: 'red',
  yellow: 'yellow',
  blue: 'blue',
  green: 'green',
  red: 'red',
  grey: 'grey',
  gray: 'gray',
  cyan: 'cyan',
  black: 'black',
  white: 'white',
  magenta: 'magenta'
}

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService extends LoggerAbstract {
  private readonly logger: winston.Logger
  private context: NullOrUndefined<string> = null
  private ctx = ContextUtil.getInstance()

  constructor() {
    super()
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOGGER_LEVEL || 'debug',
          format: combine(timestamp(), this.consoleFormat())
        })
      ],
      exitOnError: false
    })
  }

  warn(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.')
  }

  private getValueContext<K extends keyof ContextKeys>(
    context: K,
    key: keyof ContextKeys[K]
  ) {
    const values = this.ctx.getContext(context)
    return values ? (values[key] as string) : null
  }

  private consoleFormat() {
    return printf(({ level, message, timestamp }) => {
      const buildMessage: string[] = []

      const addMessage = (
        color: keyof typeof colors,
        value: string | null,
        bracket = true
      ) => {
        if (!value) return
        const msg = this.c(color, value)
        bracket ? buildMessage.push(`[ ${msg} ]`) : buildMessage.push(msg)
      }

      const tempLevel = level as keyof typeof colors
      const transactionId = this.getValueContext('logger', 'transactionId')
      const method = this.getValueContext('req', 'method')
      const originalUrl = this.getValueContext('req', 'originalUrl')
      const context = this.context || 'Main'
      const formatTime = format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
      addMessage('grey', formatTime, false)
      addMessage(tempLevel, tempLevel)
      addMessage('magenta', transactionId)
      addMessage('yellow', context)
      if (method && originalUrl) {
        addMessage('white', `(${method}) ${originalUrl}`)
      }
      addMessage('white', '::', false)
      addMessage(tempLevel, message, false)
      return buildMessage.join(' ')
    })
  }

  private c(color: keyof typeof colors, message: string): string {
    const colorizer = colorize({ colors }).colorize
    return colorizer(color, message)
  }

  debug(message: any, ...optionalParam: any[]) {
    this.logger.debug(this.buildWithOptionalParam(message, optionalParam))
  }

  verbose(message: any, ...optionalParam: any[]) {
    this.logger.verbose(this.buildWithOptionalParam(message, optionalParam))
  }

  info(message: any, ...optionalParam: any[]) {
    this.logger.info(this.buildWithOptionalParam(message, optionalParam))
  }

  error(message: any, ...optionalParam: any[]) {
    this.logger.error(this.buildWithOptionalParam(message, optionalParam))
  }

  log(msg: any, context: string) {
    this.setContext(context)
    this.info(msg)
  }

  setContext(context: string) {
    this.context = context
  }
}
