export const currentTimestampAsISO = async (): Promise<string> => {
    return new Date(Date.now()).toISOString()
}
