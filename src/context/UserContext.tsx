'use client'

import React, { createContext, useContext, useState } from 'react'

export type UserRole = 'hirer' | 'freelancer' | null

interface UserContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  userId: number | null
  setUserId: (id: number | null) => void
  walletAddress: string | null
  setWalletAddress: (wallet: string | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  return (
    <UserContext.Provider
      value={{ userRole, setUserRole, userId, setUserId, walletAddress, setWalletAddress }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
