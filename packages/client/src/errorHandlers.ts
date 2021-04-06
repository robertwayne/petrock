export const showDisconnectHeader = async () => {
    document.getElementById('disconnect-error')?.classList.remove('hidden')
    document.getElementById('page-subheader')?.classList.add('hidden')
}