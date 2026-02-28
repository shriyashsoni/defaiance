"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnect() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState("")
  const [chainId, setChainId] = useState("")
  const [nativeBalance, setNativeBalance] = useState("0.0000")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()

    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts.length) {
          disconnect()
          return
        }

        setIsConnected(true)
        setAddress(accounts[0])
      }

      const handleChainChanged = (nextChainId: string) => {
        setChainId(nextChainId)
        getNetwork(nextChainId)
      }

      window.ethereum.on?.("accountsChanged", handleAccountsChanged)
      window.ethereum.on?.("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener?.("chainChanged", handleChainChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (!isConnected || !address) return

    fetchBalance()
    const interval = window.setInterval(() => {
      fetchBalance()
    }, 15000)

    return () => window.clearInterval(interval)
  }, [isConnected, address, chainId])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0])
          const currentChainId = await getNetwork()
          setChainId(currentChainId)
          await fetchBalance(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const getNetwork = async (providedChainId?: string) => {
    try {
      const currentChainId = providedChainId || (await window.ethereum.request({ method: "eth_chainId" }))
      const networks: { [key: string]: string } = {
        "0x1": "Ethereum",
        "0x38": "BSC",
        "0x61": "BSC Testnet",
        "0x89": "Polygon",
        "0xa4b1": "Arbitrum",
      }
      setNetwork(networks[currentChainId] || "Unknown")
      return currentChainId
    } catch (error) {
      console.error("Error getting network:", error)
      return ""
    }
  }

  const fetchBalance = async (walletAddress?: string) => {
    if (typeof window.ethereum === "undefined") return

    const targetAddress = walletAddress || address
    if (!targetAddress) return

    try {
      const hexBalance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [targetAddress, "latest"],
      })

      const wei = BigInt(hexBalance)
      const whole = wei / 10n ** 18n
      const fraction = ((wei % 10n ** 18n) * 10000n) / 10n ** 18n
      setNativeBalance(`${whole.toString()}.${fraction.toString().padStart(4, "0")}`)
    } catch (error) {
      console.error("Error getting wallet balance:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!")
      return
    }

    setIsLoading(true)
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const accounts = await window.ethereum.request({ method: "eth_accounts" })

      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(accounts[0])
        const currentChainId = await getNetwork()
        setChainId(currentChainId)
        await fetchBalance(accounts[0])
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("User rejected request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      })
      const currentChainId = await getNetwork("0x38")
      setChainId(currentChainId)
      await fetchBalance()
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain",
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          })
          const currentChainId = await getNetwork("0x38")
          setChainId(currentChainId)
          await fetchBalance()
        } catch (addError) {
          console.error("Error adding BSC network:", addError)
        }
      }
    }
  }

  const switchToEthereum = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      })
      const currentChainId = await getNetwork("0x1")
      setChainId(currentChainId)
      await fetchBalance()
    } catch (error) {
      console.error("Error switching to Ethereum:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress("")
    setNetwork("")
    setChainId("")
    setNativeBalance("0.0000")
  }

  const nativeSymbol = chainId === "0x38" || chainId === "0x61" ? "BNB" : "ETH"

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-yellow-400/50 text-white hover:bg-yellow-400/10 max-w-[160px] sm:max-w-none px-2.5 sm:px-4">
            <Wallet className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="truncate text-xs sm:text-sm">{address.slice(0, 6)}...{address.slice(-4)}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border-yellow-400/50 w-72 max-w-[90vw]">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Network:</span>
              <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">{network}</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Balance:</span>
              <span className="text-sm text-white font-mono">
                {nativeBalance} {nativeSymbol}
              </span>
            </div>
            <div className="text-xs text-white/60 mb-3">{address}</div>
          </div>
          <DropdownMenuItem onClick={switchToEthereum} className="text-white hover:bg-yellow-400/10">
            Switch to Ethereum
          </DropdownMenuItem>
          <DropdownMenuItem onClick={switchToBSC} className="text-white hover:bg-yellow-400/10">
            Switch to BSC
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} className="text-yellow-300 hover:bg-yellow-400/10">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isLoading}
      className="bg-yellow-400 hover:bg-yellow-300 text-black border-0 px-3 sm:px-4 text-xs sm:text-sm"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
