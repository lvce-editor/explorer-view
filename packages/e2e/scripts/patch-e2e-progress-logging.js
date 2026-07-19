import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const nodeModulesPath = join(import.meta.dirname, '..', '..', '..', 'node_modules', '@lvce-editor')
const testWorkerPath = join(nodeModulesPath, 'test-worker', 'dist', 'testWorkerMain.js')
const playwrightWorkerPath = join(nodeModulesPath, 'test-with-playwright-worker', 'dist', 'workerMain.js')

const progressBefore = `  for (const test of tests) {
    const result = await executeAllTest(test, globals);
    results.push(result);
  }`

const progressAfter = `  for (const test of tests) {
    console.info(\`[e2e-progress] start \${test.name}\`);
    await invoke('TestFrameWork.showOverlay', 'skip', 'yellow', \`[e2e-progress] \${test.name}\`);
    const start = performance.now();
    let timeoutId;
    const timeoutResult = new Promise(resolve => {
      timeoutId = setTimeout(() => {
        const end = performance.now();
        resolve({
          end,
          error: \`[e2e-progress] \${test.name} timed out after 90000ms\`,
          name: test.name,
          start,
          status: 'fail'
        });
      }, 90_000);
    });
    const result = await Promise.race([executeAllTest(test, globals), timeoutResult]);
    clearTimeout(timeoutId);
    console.info(\`[e2e-progress] end \${test.name} \${result.status}\`);
    results.push(result);
    if (result.error.startsWith('[e2e-progress]')) {
      break;
    }
  }`

const progressAfterWithoutTimeout = `  for (const test of tests) {
    console.info(\`[e2e-progress] start \${test.name}\`);
    await invoke('TestFrameWork.showOverlay', 'skip', 'yellow', \`[e2e-progress] \${test.name}\`);
    const result = await executeAllTest(test, globals);
    console.info(\`[e2e-progress] end \${test.name} \${result.status}\`);
    results.push(result);
  }`

const progressAfterWithoutOverlay = `  for (const test of tests) {
    console.info(\`[e2e-progress] start \${test.name}\`);
    const result = await executeAllTest(test, globals);
    console.info(\`[e2e-progress] end \${test.name} \${result.status}\`);
    results.push(result);
  }`

const browserConsoleBefore = `  const page = await browserInstance.newPage();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises`

const browserConsoleAfter = `  const page = await browserInstance.newPage();
  page.on('console', message => {
    console.info(\`[browser-console:\${message.type()}] \${message.text()}\`);
  });
  page.on('pageerror', error => {
    console.error(\`[browser-pageerror] \${error.stack || error.message}\`);
  });
  await page.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => {
      let previous = '';
      const observer = new MutationObserver(() => {
        const current = document.querySelector('#TestOverlay')?.textContent || '';
        if (current.startsWith('[e2e-progress]') && current !== previous) {
          previous = current;
          console.info(current);
        }
      });
      observer.observe(document.documentElement, {
        characterData: true,
        childList: true,
        subtree: true
      });
    });
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises`

const browserConsoleAfterWithoutProgressObserver = `  const page = await browserInstance.newPage();
  page.on('console', message => {
    console.info(\`[browser-console:\${message.type()}] \${message.text()}\`);
  });
  page.on('pageerror', error => {
    console.error(\`[browser-pageerror] \${error.stack || error.message}\`);
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises`

const patchFile = async (path, before, after, previous = []) => {
  const content = await readFile(path, 'utf8')
  if (content.includes(after)) {
    return
  }
  for (const earlier of previous) {
    if (content.includes(earlier)) {
      await writeFile(path, content.replace(earlier, after))
      return
    }
  }
  if (!content.includes(before)) {
    throw new Error(`Could not patch ${path}`)
  }
  await writeFile(path, content.replace(before, after))
}

await patchFile(testWorkerPath, progressBefore, progressAfter, [progressAfterWithoutTimeout, progressAfterWithoutOverlay])
await patchFile(playwrightWorkerPath, browserConsoleBefore, browserConsoleAfter, [browserConsoleAfterWithoutProgressObserver])
