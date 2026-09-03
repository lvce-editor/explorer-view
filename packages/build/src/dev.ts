import { execa } from 'execa'
import { resolveServerPath } from './resolveServerPath.ts'
import { root } from './root.ts'

const main = async (): Promise<void> => {
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa('node', [resolveServerPath(), '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
