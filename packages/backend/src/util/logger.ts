import chalk from "chalk"

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG"

const logLevelColors: Record<LogLevel, chalk.Chalk> = {
  INFO: chalk.green,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  DEBUG: chalk.blue,
}

export function log(level: LogLevel, force: boolean, ...messages: any[]) {
  if (process.env.NODE_ENV !== "test" || force) {
    const color = logLevelColors[level]
    if (level === "ERROR") {
      // eslint-disable-next-line no-console
      console.error(color(`[${level}]`), ...messages)
      return
    }
    // eslint-disable-next-line no-console
    console.log(color(`[${level}]`), ...messages)
  }
}

export function info(...messages: any[]) {
  log("INFO", false, ...messages)
}

export function warn(...messages: any[]) {
  log("WARN", false, ...messages)
}

export function error(...messages: any[]) {
  log("ERROR", false, ...messages)
}

export function debug(...messages: any[]) {
  log("DEBUG", false, ...messages)
}
