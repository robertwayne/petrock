export const currentTimestampAsISO = async () => {
    return new Date(Date.now()).toISOString()
}
