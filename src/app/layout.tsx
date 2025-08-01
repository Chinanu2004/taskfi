// /app/layout.tsx
'use client'

// /app/layout.tsx (top of file)
import '@solana/wallet-adapter-react-ui/styles.css'
import './globals.css'
import { ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'
import { WalletSyncWrapper } from '@/components/WalletSyncWrapper'

// 🛠 Import the network enum:
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

// 🛠 Import actual adapters:
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  TorusWalletAdapter,
  CoinbaseWalletAdapter,
  // you can add more, e.g. MathWalletAdapter, SafePalAdapter, WalletConnectAdapter, etc.
} from '@solana/wallet-adapter-wallets'

export default function RootLayout({ children }: { children: ReactNode }) {
  // Use the enum, not a bare string
  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)

  // Instantiate adapters once:
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CloverWalletAdapter(),
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
      // new MathWalletAdapter(),       // optional
      // new SafePalWalletAdapter(),    // optional
      // new WalletConnectWalletAdapter({ infuraId: process.env.INFURA_ID! }), // optional
    ],
    [network]
  )

  const WalletModalProvider = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletModalProvider),
    { ssr: false }
  )

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <WalletSyncWrapper>
                <Providers>
                  <Toaster position="top-right" />
                  {children}
                </Providers>
              </WalletSyncWrapper>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  )
}
