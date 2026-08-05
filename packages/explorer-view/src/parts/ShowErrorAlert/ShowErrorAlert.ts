import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'

export const showErrorAlert = async (errorMessage: string): Promise<void> => {
  await ConfirmPrompt.confirm(errorMessage)
}
