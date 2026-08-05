import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'

export const showErrorAlert = async (errorMessage: string, isTest: boolean = false): Promise<void> => {
  await ConfirmPrompt.confirm(errorMessage, isTest)
}
