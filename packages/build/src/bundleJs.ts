import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup, type RollupOptions } from 'rollup'
import { root } from './root.ts'

const getOptions = (sourcemap: boolean): RollupOptions => ({
  input: join(root, 'packages/explorer-view/src/explorerViewWorkerMain.ts'),
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: join(root, '.tmp/dist/dist/explorerViewWorkerMain.js'),
    format: 'es',
    freeze: false,
    sourcemap,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  external: ['ws', 'electron'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
})

export const bundleJs = async (sourcemap = false): Promise<void> => {
  const options = getOptions(sourcemap)
  const input = await rollup(options)
  await input.write(options.output as any)
}
