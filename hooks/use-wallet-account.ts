"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWalletAccount() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string>("")

  useEffect(() => {
    const sync = async () => {
      if (typeof window.ethereum === "undefined") {
        setAccount(null)
        setChainId("")
        return
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const nextChainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(nextChainId)
        setAccount(Array.isArray(accounts) && accounts.length ? accounts[0] : null)
      } catch {
        setAccount(null)
      }
    }

    sync()

    if (typeof window.ethereum !== "undefined") {
      const onAccounts = (accounts: string[]) => setAccount(accounts.length ? accounts[0] : null)
      const onChain = (nextChainId: string) => setChainId(nextChainId)

      window.ethereum.on?.("accountsChanged", onAccounts)
      window.ethereum.on?.("chainChanged", onChain)

      return () => {
        window.ethereum.removeListener?.("accountsChanged", onAccounts)
        window.ethereum.removeListener?.("chainChanged", onChain)
      }
    }
  }, [])

  return { account, chainId, isConnected: !!account }
}
