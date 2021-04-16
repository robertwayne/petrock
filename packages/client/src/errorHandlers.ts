export const showDisconnectHeader = async (): Promise<void> => {
    document.getElementById('disconnect-error')?.classList.remove('hidden')
    document.getElementById('page-subheader')?.classList.add('hidden')
}
