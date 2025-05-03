"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const numberVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.8, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 0.6,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  };

  // Stock chart animation
  const chartLineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-3xl flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 with stock chart styling */}
        <motion.div
          className="relative mb-4"
          initial="initial"
          animate="animate"
          variants={numberVariants}
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
            404
          </div>
          
          {/* Animated chart line behind the 404 */}
          <motion.svg
            width="300"
            height="100"
            viewBox="0 0 300 100"
            className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40"
            initial="hidden"
            animate="visible"
          >
            <motion.path
              d="M0,50 C20,30 40,80 60,60 C80,40 100,70 120,50 C140,30 160,60 180,50 C200,40 220,60 240,70 C260,80 280,30 300,50"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              variants={chartLineVariants}
            />
          </motion.svg>
          
          {/* Candle chart icons */}
          <motion.div 
            className="absolute -bottom-10 right-0 text-muted-foreground"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <svg width="120" height="40" viewBox="0 0 120 40">
              {/* Candlestick chart elements */}
              <rect x="10" y="15" width="6" height="15" fill="currentColor" opacity="0.5" />
              <line x1="13" y1="5" x2="13" y2="15" stroke="currentColor" strokeWidth="2" />
              <line x1="13" y1="30" x2="13" y2="35" stroke="currentColor" strokeWidth="2" />
              
              <rect x="30" y="10" width="6" height="20" fill="currentColor" opacity="0.5" />
              <line x1="33" y1="5" x2="33" y2="10" stroke="currentColor" strokeWidth="2" />
              <line x1="33" y1="30" x2="33" y2="35" stroke="currentColor" strokeWidth="2" />
              
              <rect x="50" y="18" width="6" height="12" fill="currentColor" opacity="0.5" />
              <line x1="53" y1="8" x2="53" y2="18" stroke="currentColor" strokeWidth="2" />
              <line x1="53" y1="30" x2="53" y2="38" stroke="currentColor" strokeWidth="2" />
              
              <rect x="70" y="22" width="6" height="10" fill="currentColor" opacity="0.5" />
              <line x1="73" y1="12" x2="73" y2="22" stroke="currentColor" strokeWidth="2" />
              <line x1="73" y1="32" x2="73" y2="36" stroke="currentColor" strokeWidth="2" />
              
              <rect x="90" y="8" width="6" height="22" fill="currentColor" opacity="0.5" />
              <line x1="93" y1="3" x2="93" y2="8" stroke="currentColor" strokeWidth="2" />
              <line x1="93" y1="30" x2="93" y2="38" stroke="currentColor" strokeWidth="2" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Error messages */}
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold mb-2"
          variants={itemVariants}
        >
          Không tìm thấy trang
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground mb-8 max-w-md"
          variants={itemVariants}
        >
          Giao dịch bạn đang tìm kiếm không khả dụng hoặc đã bị hủy bỏ.
          Vui lòng thử lại với một chứng khoán khác.
        </motion.p>

        {/* Animated buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center"
          variants={itemVariants}
        >
          <Link href="/">
            <Button 
              size="lg" 
              className="gap-2"
              variant="default"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <MoveLeft className="h-4 w-4" />
            Quay lại
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost" 
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại trang
          </Button>
        </motion.div>
        
        {/* Market ticker animation */}
        <motion.div 
          className="w-full mt-16 overflow-hidden relative h-10 border-t border-b border-border"
          variants={itemVariants}
        >
          <motion.div 
            className="whitespace-nowrap absolute"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 20, 
              ease: "linear" 
            }}
          >
            <span className="inline-flex items-center mx-4">
              VNI <span className="text-green-500 ml-2">+4.28 (+0.35%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              HNX <span className="text-red-500 ml-2">-1.85 (-0.72%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              UPCOM <span className="text-green-500 ml-2">+0.42 (+0.38%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              VN30 <span className="text-green-500 ml-2">+5.64 (+0.45%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              SSI <span className="text-red-500 ml-2">-650 (-2.12%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              VIC <span className="text-green-500 ml-2">+250 (+0.48%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              VHM <span className="text-green-500 ml-2">+150 (+0.32%)</span>
            </span>
            <span className="inline-flex items-center mx-4">
              FPT <span className="text-green-500 ml-2">+1250 (+0.98%)</span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 