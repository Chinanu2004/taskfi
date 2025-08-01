// lib/verifySignature.ts
import { WalletContextState } from '@solana/wallet-adapter-react';

export async function verifyWalletSignature(wallet: WalletContextState, address: string) {
  const message = `Verify ownership of wallet: ${address}`;
  const encodedMessage = new TextEncoder().encode(message);
  const signed = await wallet.signMessage!(encodedMessage); // Use non-null assertion if using optional chaining

  const signature = Buffer.from(signed).toString('base64');

  const res = await fetch('/api/verify-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature, walletAddress: address }),
  });

  const data = await res.json();
  return data?.verified;
}
