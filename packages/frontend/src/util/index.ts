export function getClientTimezone() {
  const date = new Date()
  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
  const dateStr = new Date(now_utc).toString()
  const timeZoneRegex = /GMT[+-](\d*)/
  const res = dateStr.match(timeZoneRegex)
  if (!res) {
    return ['GMT+0', '0']
  }

  return [res[0], res[1]]
}
