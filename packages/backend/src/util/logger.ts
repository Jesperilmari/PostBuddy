import chalk from "chalk"

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG"

const logLevelColors: Record<LogLevel, chalk.Chalk> = {
  INFO: chalk.green,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  DEBUG: chalk.blue,
}

export function log(level: LogLevel, ...messages: any[]) {
  if (process.env.NODE_ENV !== "test") {
    const color = logLevelColors[level]
    console.log(color(`[${level}]`), ...messages)
  }
}

export function info(...messages: any[]) {
  log("INFO", ...messages)
}

export function warn(...messages: any[]) {
  log("WARN", ...messages)
}

export function error(...messages: any[]) {
  log("ERROR", ...messages)
}

export function debug(...messages: any[]) {
  log("DEBUG", ...messages)
}
