"use client"

import { motion } from "framer-motion"
import { Coins, Zap, Shield, Globe, Brain, Target } from "lucide-react"

export default function FloatingElements() {
  const elements = [
    { icon: <Coins className="h-6 w-6" />, delay: 0, x: "10%", y: "20%" },
    { icon: <Zap className="h-8 w-8" />, delay: 1, x: "80%", y: "15%" },
    { icon: <Shield className="h-5 w-5" />, delay: 2, x: "15%", y: "70%" },
    { icon: <Globe className="h-7 w-7" />, delay: 3, x: "85%", y: "60%" },
    { icon: <Brain className="h-6 w-6" />, delay: 4, x: "5%", y: "45%" },
    { icon: <Target className="h-5 w-5" />, delay: 5, x: "90%", y: "35%" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/20"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  )
}
