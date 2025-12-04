export type LrcLine = {
  time: number
  text: string
}
/**
 * 解析 LRC 字符串为可用于同步的行数组
 * 支持多时间戳的行 (例如 `[00:10.00][00:30.00]重复行`) 和毫秒解析
 * 返回的数组按时间升序排列，time 为秒 (number)。
 */
export function parseLrc(lrcText: string): LrcLine[] {
  const lines = lrcText.split(/\r?\n/)
  const timeTagRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g
  const result: LrcLine[] = []

  for (const raw of lines) {
    let matched = false
    let match: RegExpExecArray | null
    // 收集行中的所有时间戳
    const timestamps: number[] = []
    while ((match = timeTagRegex.exec(raw)) !== null) {
      matched = true
      const min = parseInt(match[1], 10)
      const sec = parseInt(match[2], 10)
      const ms = match[3] ? parseInt((match[3] + (match[3].length === 2 ? '0' : '')).slice(0,3), 10) : 0
      const timeSec = min * 60 + sec + ms / 1000
      timestamps.push(timeSec)
    }

    const text = raw.replace(/\[(?:\d{1,2}:\d{2}(?:\.\d{1,3})?)\]/g, '').trim()
    if (matched) {
      for (const t of timestamps) {
        result.push({ time: t, text })
      }
    } else if (text) {
      // 如果没有时间戳但有文本，请按-1，使其显示在顶部
      result.push({ time: -1, text })
    }
  }

  return result
    .filter(r => r.text !== '')
    .sort((a, b) => a.time - b.time)
}