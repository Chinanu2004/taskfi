// /components/ConnectWallet.tsx
'use client'

import dynamic from 'next/dynamic'

// dynamic import so SSR won’t break
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
)

export default function ConnectWallet() {
  return <WalletMultiButton className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700" />
}
