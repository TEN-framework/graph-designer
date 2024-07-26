import { formatTime } from "./utils"
import { LogLevel } from "../types"

export interface LoggerConfig {
  level?: LogLevel
  prefix?: string
}

class Logger {
  level: LogLevel = LogLevel.ERROR
  prefix?: string = ""
  preTime?: number = 0

  constructor(config: LoggerConfig) {
    const { level, prefix } = config
    if (level !== undefined) {
      this.level = level
    }
    if (prefix) {
      this.prefix = prefix
    }
  }

  setLogLevel(level: LogLevel) {
    this.level = level
  }

  debug(...args: any[]) {
    this.level <= LogLevel.DEBUG &&
      this._log(`${this._genPrefix()}[DEBUG]: `, ...args)
  }

  warn(...args: any[]) {
    this.level <= LogLevel.WARN &&
      this._warn(`${this._genPrefix()}[WARN]: `, ...args)
  }

  error(...args: any[]) {
    this.level <= LogLevel.ERROR &&
      this._err(`${this._genPrefix()}[ERROR]: `, ...args)
  }

  time(...args: any[]) {
    const time = new Date().getTime()
    let cost = 0
    let start = ""
    if (this.preTime) {
      cost = time - this.preTime
    } else {
      start = "start"
    }
    this.preTime = time
    this._log(
      `${this._genPrefix()}[time]:  -------------- cost:${cost}ms ${start} -----------------   \n`,
      ...args,
    )
  }

  timeEnd(...args: any[]) {
    const time = new Date().getTime()
    let cost = 0
    if (this.preTime) {
      cost = time - this.preTime
    }
    this.preTime = 0
    this._log(
      `${this._genPrefix()}[time]:  -------------- cost:${cost}ms end -----------------   \n`,
      ...args,
    )
  }

  //  ---------------------------- private ----------------------------

  private _log(...args: any[]) {
    const [arg, ...other] = args
    console.log(`%c${arg}`, "color:yellow", ...other)
  }

  private _warn(...args: any[]) {
    const [arg, ...other] = args
    console.warn(`%c${arg}`, "color:yellow", ...other)
  }

  private _err(...args: any[]) {
    let res = ""
    for (const item of args) {
      res += typeof item == "string" ? item : JSON.stringify(item)
    }
    console.error(res)
  }

  private _genPrefix() {
    return formatTime() + (this.prefix ? ` [${this.prefix}]` : "")
  }
}

export const logger = new Logger({
  level: LogLevel.DEBUG,
  prefix: "editor",
})

export default Logger
