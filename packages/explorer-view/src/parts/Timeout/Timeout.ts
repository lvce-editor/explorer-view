export const sleep = async (duration: number): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers()
  setTimeout(resolve, duration)
  await promise
}
