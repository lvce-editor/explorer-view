import { threshold, workerPath } from './config.ts'
import { MemoryLimitExceededError } from './errors.ts'
import { getMemoryUsageWs } from './getMemoryUsageWs.ts'
import { launchBrowser } from './launchBrowser.ts'
import { parseArgs } from './parseArgs.ts'
import { startServer } from './server.ts'
import { waitForWorkerReady } from './waitForWorkerReady.ts'

const main = async () => {
  if (process.platform === 'win32') {
    // not supported
    return
  }
  const options = parseArgs()

  const server = await startServer(options.port, workerPath)

  const remoteDebuggingPort = '9222'

  const { page, browser } = await launchBrowser(options.headless, remoteDebuggingPort)

  try {
    await page.goto(`http://localhost:${options.port}`)
    await waitForWorkerReady(page)

    const memoryUsage = await getMemoryUsageWs(remoteDebuggingPort)
    console.log('[memory] Worker Memory Usage:', memoryUsage)
    if (memoryUsage.usedSize >= threshold) {
      throw new MemoryLimitExceededError(threshold, memoryUsage.usedSize)
    }
  } catch (error) {
    console.error('[memory] Measurement failed:', error)
    process.exit(1)
  } finally {
    server.close()
    await browser.close()
  }
}

main()
