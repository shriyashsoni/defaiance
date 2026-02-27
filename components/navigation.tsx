"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import WalletConnect from "@/components/wallet-connect"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const syncConnection = async () => {
      if (typeof window.ethereum === "undefined") {
        setIsWalletConnected(false)
        return
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        setIsWalletConnected(Array.isArray(accounts) && accounts.length > 0)
      } catch {
        setIsWalletConnected(false)
      }
    }

    syncConnection()

    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        setIsWalletConnected(Array.isArray(accounts) && accounts.length > 0)
      }

      window.ethereum.on?.("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const staticNavItems = [
    { name: "Submit Product", href: "/submit-product" },
    { name: "Whitepaper", href: "/whitepaper" },
  ]

  const dynamicNavItems = isWalletConnected ? [{ name: "Dashboard", href: "/dashboard" }] : []
  const navItems = [...staticNavItems, ...dynamicNavItems]

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-yellow-400/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="DEFAIANCE" width={50} height={50} className="rounded-full" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              DEFAIANCE
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`relative px-3 py-2 transition-colors duration-300 ${
                  isActive(item.href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-200"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <WalletConnect />

          {/* Mobile Menu */}
          {navItems.length > 0 && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-yellow-400/30">
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg transition-colors duration-300 ${
                        isActive(item.href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}
