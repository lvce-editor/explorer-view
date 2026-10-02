import { defineConfig } from '@lvce-editor/test-with-playwright'

export default defineConfig({
  coverageTarget: 'explorerViewWorkerMain.js',
  coverageInclude: 'packages/explorer-view/src/',
  coverageThreshold: 90,
  onlyExtension: '.',
  serverPath: '../server/src/server.js',
  testPath: '.',
})
