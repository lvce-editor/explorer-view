import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'
import { initializeIconThemeWorker } from '../InitializeIconThemeWorker/InitializeIconThemeWorker.ts'
import { initializeSourceControlWorker } from '../InitializeSourceControlWorker/InitializeSourceControlWorker.ts'

export const initialize = async (): Promise<void> => {
  await Promise.all([initializeFileSystemWorker(), initializeIconThemeWorker(), initializeSourceControlWorker()])
}
