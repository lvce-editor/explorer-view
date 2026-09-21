import childProcess from 'node:child_process'
import { syncBuiltinESMExports } from 'node:module'

const fork = childProcess.fork
let transfers = 0

const instrument = (child) => {
  const send = child.send
  child.send = function (message, socket, ...args) {
    const handle = socket?._handle
    const reading = handle?.reading
    const result = send.call(this, message, socket, ...args)
    if (handle && socket._handle === null) {
      transfers++
      const method = message?.method
      const onread = handle.onread
      handle.onread = function (buffer) {
        if (buffer?.byteLength) {
          console.error('[socket-handoff-discard]', JSON.stringify({ pid: process.pid, time: Date.now(), method, reading, bytes: buffer.byteLength }))
        }
        return onread.apply(this, arguments)
      }
      if (transfers === 1) console.error('[socket-handoff-capture]', JSON.stringify({ pid: process.pid, method, reading }))
    }
    return result
  }

  return child
}

childProcess.fork = (...args) => instrument(fork(...args))
syncBuiltinESMExports()
