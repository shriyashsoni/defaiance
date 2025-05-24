"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, Clock, Star, Shield, Target, CheckCircle, Info } from "lucide-react"
import Image from "next/image"

interface InvestmentModalProps {
  startup: any
  isOpen: boolean
  onClose: () => void
}

export default function InvestmentModal({ startup, isOpen, onClose }: InvestmentModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [investmentComplete, setInvestmentComplete] = useState(false)

  if (!startup) return null

  const handleInvestment = async () => {
    setIsInvesting(true)

    // Simulate investment process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsInvesting(false)
    setInvestmentComplete(true)

    // Reset after showing success
    setTimeout(() => {
      setInvestmentComplete(false)
      onClose()
    }, 2000)
  }

  const calculateTokens = () => {
    const amount = Number.parseFloat(investmentAmount) || 0
    return Math.floor(amount / startup.tokenPrice)
  }

  const calculateEquity = () => {
    const tokens = calculateTokens()
    return ((tokens / startup.totalTokens) * 100).toFixed(4)
  }

  const progressPercentage = (startup.raised / startup.target) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {investmentComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Investment Successful!</h2>
              <p className="text-gray-400">
                You've successfully invested ${investmentAmount} in {startup.name}
              </p>
              <p className="text-gray-400 mt-2">
                You now own {calculateTokens().toLocaleString()} tokens ({calculateEquity()}% equity)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader className="mb-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={startup.logo || "/placeholder.svg"}
                    alt={startup.name}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div>
                    <DialogTitle className="text-2xl text-white">{startup.name}</DialogTitle>
                    <DialogDescription className="text-gray-400 text-lg">{startup.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="invest" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                  <TabsTrigger value="invest" className="data-[state=active]:bg-blue-500">
                    Invest
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-purple-500">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-500">
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="invest" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Investment Form */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Make Investment</CardTitle>
                        <CardDescription className="text-gray-400">Enter the amount you want to invest</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="amount" className="text-white">
                            Investment Amount (USD)
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            className="bg-white/5 border-white/10 text-white mt-2"
                          />
                        </div>

                        {investmentAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 p-4 bg-white/5 rounded-lg"
                          >
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tokens to receive:</span>
                              <span className="text-white font-semibold">{calculateTokens().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Equity percentage:</span>
                              <span className="text-white font-semibold">{calculateEquity()}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Token price:</span>
                              <span className="text-white font-semibold">${startup.tokenPrice}</span>
                            </div>
                          </motion.div>
                        )}

                        <Button
                          onClick={handleInvestment}
                          disabled={!investmentAmount || isInvesting}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isInvesting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="mr-2"
                            >
                              <DollarSign className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <DollarSign className="h-4 w-4 mr-2" />
                          )}
                          {isInvesting ? "Processing Investment..." : "Invest Now"}
                        </Button>

                        <div className="text-xs text-gray-500 space-y-1">
                          <p>• Minimum investment: $50</p>
                          <p>• Transaction fee: 2.5%</p>
                          <p>• Tokens will be transferred to your wallet</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Campaign Info */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Target className="h-5 w-5 mr-2 text-blue-400" />
                          Campaign Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Raised</span>
                            <span className="text-white font-semibold">
                              ${startup.raised.toLocaleString()} / ${startup.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                          <div className="text-xs text-gray-400 mt-1">{progressPercentage.toFixed(1)}% funded</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                            <div className="text-white font-semibold">{startup.investors || 0}</div>
                            <div className="text-gray-400 text-xs">Investors</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                            <div className="text-white font-semibold">{startup.daysLeft || 0}</div>
                            <div className="text-gray-400 text-xs">Days Left</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">AI Score</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Star className="h-3 w-3 mr-1" />
                              {startup.aiScore}/100
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Stage</span>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{startup.stage}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Industry</span>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {startup.industry}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Company Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300">{startup.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Founded:</span>
                            <span className="text-white">2023</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Employees:</span>
                            <span className="text-white">15-25</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white">San Francisco, CA</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Token Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Token Price:</span>
                            <span className="text-white">${startup.tokenPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Supply:</span>
                            <span className="text-white">{startup.totalTokens?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Available:</span>
                            <span className="text-white">{startup.availableTokens?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Token Standard:</span>
                            <span className="text-white">ERC-20</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">AI Risk Assessment</CardTitle>
                      <CardDescription className="text-gray-400">Powered by DEFAI Analytics Engine</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <div className="text-green-400 font-semibold">Low Risk</div>
                          <div className="text-gray-400 text-sm">Market Analysis</div>
                        </div>
                        <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                          <div className="text-blue-400 font-semibold">High Growth</div>
                          <div className="text-gray-400 text-sm">Potential</div>
                        </div>
                        <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <div className="text-purple-400 font-semibold">Strong Team</div>
                          <div className="text-gray-400 text-sm">Leadership</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Team Score</span>
                            <span className="text-white">92/100</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Market Opportunity</span>
                            <span className="text-white">88/100</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Technology</span>
                            <span className="text-white">95/100</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Financial Health</span>
                            <span className="text-white">85/100</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="text-blue-400 font-semibold mb-1">AI Recommendation</h4>
                            <p className="text-gray-300 text-sm">
                              This startup shows strong fundamentals with experienced leadership and innovative
                              technology. Market conditions are favorable for growth in the {startup.industry} sector.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
