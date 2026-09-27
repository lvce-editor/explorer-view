from pathlib import Path
import sys

bundle = Path('node_modules/@lvce-editor/test-with-playwright-worker/dist/workerMain.js')
source = bundle.read_text()
original = """const navigateToTest = async (page, url) => {
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
};"""
replacement = r"""import { mkdirSync as diagnosticMkdirSync, appendFileSync as diagnosticAppendFileSync } from 'node:fs';
const navigationEvents = [];
let navigationSequence = 0;
let navigationProbeDone = false;
const navigationPages = new WeakSet();
const recordNavigation = (type, details = {}) => {
  navigationEvents.push({ sequence: navigationSequence++, wallTime: Date.now(), monotonicTime: performance.now(), type, ...details });
};
const navigationPath = (url) => {
  try { return new URL(url).pathname; } catch { return String(url); }
};
const probeNavigation = async (page, url) => {
  recordNavigation('health', { connected: page.context().browser()?.isConnected(), closed: page.isClosed(), url: navigationPath(page.url()) });
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const body = await response.text();
    recordNavigation('http-probe', { status: response.status, bytes: body.length });
  } catch (error) { recordNavigation('http-probe-error', { error: String(error) }); }
  let timer;
  try {
    const state = await Promise.race([
      page.evaluate(() => ({ url: location.pathname, readyState: document.readyState, overlay: document.querySelector('#TestOverlay')?.getAttribute('data-state') })),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('page evaluation probe timed out')), 3000); })
    ]);
    recordNavigation('page-probe', { state });
  } catch (error) { recordNavigation('page-probe-error', { error: String(error) }); }
  finally { clearTimeout(timer); }
  try {
    const { execFileSync } = await import('node:child_process');
    recordNavigation('processes', { table: execFileSync('ps', ['-eo', 'pid,ppid,stat,nlwp,rss,pcpu,comm'], { encoding: 'utf8', timeout: 3000 }) });
    recordNavigation('memory', { meminfo: await readFile('/proc/meminfo', 'utf8') });
  } catch (error) { recordNavigation('resource-probe-error', { error: String(error) }); }
};
const navigateToTest = async (page, url) => {
  if (!navigationPages.has(page)) {
    navigationPages.add(page);
    page.on('request', request => {
      if (request.isNavigationRequest()) recordNavigation('request', { url: navigationPath(request.url()) });
    });
    page.on('response', response => {
      if (response.request().isNavigationRequest()) recordNavigation('response', { url: navigationPath(response.url()), status: response.status() });
    });
    page.on('requestfailed', request => recordNavigation('requestfailed', { url: navigationPath(request.url()), error: request.failure()?.errorText }));
    page.on('domcontentloaded', () => recordNavigation('domcontentloaded', { url: navigationPath(page.url()) }));
    page.on('load', () => recordNavigation('load', { url: navigationPath(page.url()) }));
    page.on('crash', () => recordNavigation('crash'));
    page.on('close', () => recordNavigation('close'));
    page.on('pageerror', error => recordNavigation('pageerror', { error: String(error) }));
    page.on('worker', worker => {
      recordNavigation('worker-created', { url: navigationPath(worker.url()) });
      worker.on('close', () => recordNavigation('worker-closed', { url: navigationPath(worker.url()) }));
    });
  }
  recordNavigation('goto-start', { url: navigationPath(url) });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    recordNavigation('goto-complete', { url: navigationPath(url) });
  } catch (error) {
    recordNavigation('goto-error', { url: navigationPath(url), error: String(error) });
    if (!navigationProbeDone) {
      navigationProbeDone = true;
      await probeNavigation(page, url);
    }
    throw error;
  } finally {
    diagnosticMkdirSync('navigation-diagnostics', { recursive: true });
    diagnosticAppendFileSync(`navigation-diagnostics/navigation-${process.pid}.jsonl`, navigationEvents.splice(0).map(event => JSON.stringify(event)).join('\n') + '\n');
  }
};"""
restore = '--restore' in sys.argv
if restore:
    if source.count(replacement) == 1 and source.count(original) == 0:
        bundle.write_text(source.replace(replacement, original))
    elif source.count(original) != 1:
        raise RuntimeError('Unexpected runner while restoring navigation diagnostics')
    print(f'Restored original navigation function in {bundle}')
elif source.count(replacement) == 1 and source.count(original) == 0:
    print(f'Navigation diagnostics already installed in {bundle}')
elif source.count(original) == 1:
    bundle.write_text(source.replace(original, replacement))
    print(f'Installed test-only navigation diagnostics in {bundle}')
else:
    raise RuntimeError('Expected exactly one navigation function in the installed runner')
