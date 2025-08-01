import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'

export const useWalletAuth = () => {
  const { publicKey, signMessage } = useWallet()
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const verifyWallet = async () => {
      if (!publicKey || !signMessage) return

      setLoading(true)

      const walletAddress = publicKey.toBase58()

      // 1. Get nonce
      const res = await fetch(`/api/user/nonce?wallet=${walletAddress}`)
      const { nonce } = await res.json()

      // 2. Sign nonce
      const signed = await signMessage(new TextEncoder().encode(nonce))
      const signature = bs58.encode(signed)

      // 3. Send to backend
      const verifyRes = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: nonce, signature, wallet: walletAddress }),
      })

      if (verifyRes.ok) {
        setVerified(true)
      }

      setLoading(false)
    }

    verifyWallet()
  }, [publicKey, signMessage])

  return { verified, loading }
}
