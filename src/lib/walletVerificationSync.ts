// lib/walletVerificationSync.ts
export async function syncWalletVerification(walletAddress: string) {
  try {
    const res = await fetch(`/api/users/${walletAddress}`)
    const data = await res.json()

    if (data?.isWalletVerified) {
      localStorage.setItem('isWalletVerified', 'true')
    } else {
      localStorage.removeItem('isWalletVerified')
    }
  } catch (error) {
    console.error('Failed to sync wallet verification:', error)
  }
}
