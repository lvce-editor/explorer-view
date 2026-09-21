// @ts-nocheck -- diagnostic capture of Node private native handles
import childProcess from 'node:child_process'
import { Server } from 'node:http'
import { syncBuiltinESMExports } from 'node:module'

const listen = Server.prototype.listen
Server.prototype.listen = function (...args) {
  this.once('listening', () => console.error('[server-address]', JSON.stringify({ pid: process.pid, address: this.address() })))
  return listen.apply(this, args)
}

const fork = childProcess.fork
let transfers = 0

const instrument = (child) => {
  const send = child._send
  child._send = function (message, socket, ...args) {
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
