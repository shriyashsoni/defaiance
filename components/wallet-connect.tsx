"use client"

import { useState, useEffect } from "react"
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
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0])
          await getNetwork()
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const getNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const networks: { [key: string]: string } = {
        "0x1": "Ethereum",
        "0x38": "BSC",
        "0x89": "Polygon",
        "0xa4b1": "Arbitrum",
      }
      setNetwork(networks[chainId] || "Unknown")
    } catch (error) {
      console.error("Error getting network:", error)
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
        await getNetwork()
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
      await getNetwork()
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
          await getNetwork()
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
      await getNetwork()
    } catch (error) {
      console.error("Error switching to Ethereum:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress("")
    setNetwork("")
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Wallet className="mr-2 h-4 w-4" />
            {address.slice(0, 6)}...{address.slice(-4)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-800 border-white/20">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Network:</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{network}</Badge>
            </div>
            <div className="text-xs text-gray-500 mb-3">{address}</div>
          </div>
          <DropdownMenuItem onClick={switchToEthereum} className="text-white hover:bg-white/10">
            Switch to Ethereum
          </DropdownMenuItem>
          <DropdownMenuItem onClick={switchToBSC} className="text-white hover:bg-white/10">
            Switch to BSC
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} className="text-red-400 hover:bg-red-500/10">
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
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
