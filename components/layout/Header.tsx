"use client";

import Link from "next/link";
import { Search, Menu, X, User, Bell, BarChart3, ChevronDown, SunMoon, ArrowUpDown, TrendingUp, Maximize, Globe, LineChart, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchStocks } from "@/lib/services/stockService";
import { Stock } from "@/lib/types/stock";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Mock market data - would come from API in real implementation
  const marketIndices = [
    { name: "VN-Index", value: "1,245.78", change: "+15.32", changePercent: "+1.24%", trending: "up" },
    { name: "HNX-Index", value: "231.45", change: "+2.34", changePercent: "+1.02%", trending: "up" },
    { name: "UPCOM", value: "87.12", change: "-0.23", changePercent: "-0.26%", trending: "down" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  // Handle clicking outside the search results to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search results when the debounced query changes
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchStocks({
          search: debouncedSearchQuery,
          limit: 5,
          sortBy: 'symbol',
          sortDirection: 'asc'
        });
        setResults(response.data.stocks);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Error searching stocks:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedSearchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  // Create a reusable function to handle link clicks 
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="w-full bg-background sticky top-0 z-[9999]">
      {/* Market Ticker Bar */}
      <div className="bg-slate-50/80 backdrop-blur-md dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="container mx-auto px-4 h-10 flex items-center overflow-hidden">
          <div className="flex-shrink-0 flex items-center mr-4">
            <ArrowUpDown className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Thị trường:</span>
          </div>
          
          <div className="flex-1 flex space-x-6 overflow-hidden">
            <div className="ticker-container flex whitespace-nowrap animate-ticker">
              {[...marketIndices, ...marketIndices].map((index, i) => (
                <div key={i} className="flex items-center mr-6">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white mr-2">{index.name}</span>
                  <span className="text-xs font-medium mr-1">{index.value}</span>
                  <span 
                    className={`text-xs font-medium ${
                      index.trending === "up" 
                        ? "text-emerald-600 dark:text-emerald-500" 
                        : "text-red-600 dark:text-red-500"
                    }`}
                  >
                    {index.change} ({index.changePercent})
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0 flex gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-600 dark:text-slate-400 hover:scale-110 transition-transform">
              <Maximize className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-600 dark:text-slate-400 hover:scale-110 transition-transform">
              <Globe className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-600 dark:text-slate-400 hover:scale-110 transition-transform">
              <SunMoon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-sm shadow-primary/20">
                  <LineChart className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  <span className="text-primary">VS</span>MI
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                <Link 
                  href="/tin-tuc"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "news" 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  }`}
                  onClick={() => {
                    setActiveTab("news");
                    setIsMenuOpen(false);
                    setIsMobileSearchOpen(false);
                  }}
                >
                  <Globe className="h-4 w-4" />
                  <span>Tin tức</span>
                </Link>
                <Link 
                  href="/gioi-thieu"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "about" 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  }`}
                  onClick={() => {
                    setActiveTab("about");
                    setIsMenuOpen(false);
                    setIsMobileSearchOpen(false);
                  }}
                >
                  <Info className="h-4 w-4" />
                  <span>Giới thiệu</span>
                </Link>
                <Link 
                  href="/lien-he"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "contact" 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  }`}
                  onClick={() => {
                    setActiveTab("contact");
                    setIsMenuOpen(false);
                    setIsMobileSearchOpen(false);
                  }}
                >
                  <Mail className="h-4 w-4" />
                  <span>Liên hệ</span>
                </Link>
              </nav>
            </div>

            {/* Center - Search */}
            <div ref={searchRef} className="hidden md:block relative max-w-md w-full mx-6">
              <div className="relative rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 transition duration-300 ease-in-out focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 hover:border-primary/30">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Tìm mã cổ phiếu, công ty..." 
                  className="border-0 bg-transparent w-full pl-10 h-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-950 rounded-xl shadow-2xl dark:shadow-slate-800/20 border border-slate-200 dark:border-slate-800 z-[60] max-h-[400px] overflow-y-auto"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Kết quả tìm kiếm</div>
                    </div>
                    
                    {isLoading ? (
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex justify-center items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100"></div>
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200"></div>
                        </div>
                      </div>
                    ) : results.length > 0 ? (
                      <ul className="py-1">
                        {results.map((stock) => (
                          <motion.li 
                            key={stock.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="touch-manipulation pointer-events-auto px-3"
                          >
                            <a 
                              href={`/ma-chung-khoan/${stock.symbol.toLowerCase()}`}
                              className="block w-full text-left py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors active:bg-slate-100 dark:active:bg-slate-800 rounded-lg px-3"
                              onClick={() => {
                                setSearchQuery("");
                                setIsSearchOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 flex items-center justify-center text-primary font-medium">
                                    {stock.symbol.slice(0, 2)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{stock.symbol}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">{stock.name}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="font-medium text-slate-900 dark:text-white">157.24</span>
                                  <span className="text-xs text-emerald-600 dark:text-emerald-500">+2.35 (1.52%)</span>
                                </div>
                              </div>
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    ) : searchQuery.length > 0 ? (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                          <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">Không tìm thấy kết quả phù hợp</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác</p>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-1.5">
              {/* User button - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-transform hover:scale-105"
                >
                  <Bell className="h-4.5 w-4.5" />
                </Button>
                
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 gap-2 flex transition-transform hover:scale-105"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span>Đăng nhập</span>
                  </Button>
                </div>
              </div>

              {/* Mobile search button */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors"
                  onClick={toggleMobileSearch}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Mobile menu button */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 bg-white dark:bg-slate-950 z-[110] pt-[126px]"
          >
            <div className="absolute right-4 top-[82px]">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-700 dark:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>
            
            <div className="container p-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link 
                    href="/tin-tuc"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Tin tức</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Link 
                    href="/gioi-thieu"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <Info className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Giới thiệu</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link 
                    href="/lien-he"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Liên hệ</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="h-px bg-slate-200 dark:bg-slate-700 my-6"
                ></motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Link 
                    href="/dang-nhap"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Đăng nhập</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 bg-white dark:bg-slate-950 z-[110] pt-[126px]"
          >
            <div className="absolute right-4 top-[82px]">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="text-slate-700 dark:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>
            
            <div className="container p-4">
              {/* Mobile search */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative mb-6"
              >
                <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition duration-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 shadow-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <Input 
                    type="search" 
                    placeholder="Tìm mã cổ phiếu, công ty..." 
                    className="border-0 bg-transparent w-full pl-11 h-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                </div>
                
                {/* Mobile Search Results */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-slate-900/20 max-h-[70vh] overflow-y-auto z-[100] relative"
                    >
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Kết quả tìm kiếm</div>
                      </div>
                      
                      {isLoading ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                          <div className="flex justify-center items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100"></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200"></div>
                          </div>
                        </div>
                      ) : results.length > 0 ? (
                        <ul className="py-1">
                          {results.map((stock, index) => (
                            <motion.li 
                              key={stock.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="touch-manipulation pointer-events-auto px-3"
                            >
                              <a
                                href={`/ma-chung-khoan/${stock.symbol.toLowerCase()}`}
                                className="block w-full text-left py-3 hover:bg-slate-50 dark:hover:bg-slate-900 active:bg-slate-100 dark:active:bg-slate-800 rounded-lg px-3 transition-colors"
                                onClick={() => {
                                  setSearchQuery("");
                                  setIsSearchOpen(false);
                                  setIsMobileSearchOpen(false);
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 flex items-center justify-center text-primary font-medium">
                                      {stock.symbol.slice(0, 2)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900 dark:text-white">{stock.symbol}</p>
                                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[240px]">{stock.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="font-medium text-slate-900 dark:text-white">157.24</span>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-500">+2.35 (1.52%)</span>
                                  </div>
                                </div>
                              </a>
                            </motion.li>
                          ))}
                        </ul>
                      ) : searchQuery.length > 0 ? (
                        <div className="p-6 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                            <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">Không tìm thấy kết quả phù hợp</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vui lòng thử lại với từ khóa khác</p>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                            <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">Nhập từ khóa để tìm kiếm</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tìm theo mã hoặc tên công ty</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Quick Shortcuts */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-8"
              >
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Mã theo dõi gần đây</h3>
                <div className="grid grid-cols-3 gap-3">
                  <QuickStockCard symbol="VNM" price="74.5" change="+1.2%" trending="up" />
                  <QuickStockCard symbol="FPT" price="112.3" change="+2.1%" trending="up" />
                  <QuickStockCard symbol="VIC" price="45.2" change="-0.5%" trending="down" />
                  <QuickStockCard symbol="VHM" price="51.8" change="+0.7%" trending="up" />
                  <QuickStockCard symbol="HPG" price="21.6" change="-1.3%" trending="down" />
                  <QuickStockCard symbol="MSN" price="89.4" change="+1.8%" trending="up" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function QuickStockCard({ 
  symbol, 
  price, 
  change, 
  trending 
}: { 
  symbol: string; 
  price: string; 
  change: string; 
  trending: "up" | "down";
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={`/ma-chung-khoan/${symbol.toLowerCase()}`}
        className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <span className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{symbol}</span>
        <span className="text-base text-slate-700 dark:text-slate-300">{price}</span>
        <span 
          className={`text-xs font-medium ${
            trending === "up" 
              ? "text-emerald-600 dark:text-emerald-500" 
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {change}
        </span>
      </Link>
    </motion.div>
  );
}

// Add this to your CSS (globals.css or tailwind.config.js)
// @keyframes ticker {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
// .animate-ticker {
//   animation: ticker 30s linear infinite;
// }

