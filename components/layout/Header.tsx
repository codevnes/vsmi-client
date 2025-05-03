"use client";

import Link from "next/link";
import { Search, Menu, X, User, ChevronRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchStocks } from "@/lib/services/stockService";
import { Stock } from "@/lib/types/stock";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  // Handle clicking on a search result
  const handleResultClick = (symbol: string) => {
    router.push(`/ma-chung-khoan/${symbol.toLowerCase()}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      {/* Top bar */}
      <div className="bg-primary/5 dark:bg-primary/10 h-1.5 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse"></div>
      </div>
      
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <BarChart2 className="h-5 w-5 text-primary" strokeWidth={2.5} />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">VS</span>MI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Trang chủ</NavLink>
            <NavLink href="/gioi-thieu">Giới thiệu</NavLink>
            <NavLink href="/tin-tuc">Tin tức</NavLink>
            <NavLink href="/lien-he">Liên hệ</NavLink>
          </nav>

          {/* Search box (desktop) */}
          <div ref={searchRef} className="hidden md:block relative max-w-md w-full mx-4">
            <div className="relative rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input 
                type="search" 
                placeholder="Tìm cổ phiếu..." 
                className="border-0 bg-transparent w-full pl-9 h-9 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-md shadow-lg dark:shadow-slate-800/20 border border-slate-200 dark:border-slate-700 z-50 max-h-[300px] overflow-y-auto">
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
                      <li 
                        key={stock.id} 
                        className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(stock.symbol)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-medium">
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{stock.symbol}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{stock.name}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{stock.exchange}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.length > 0 ? (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400">Không tìm thấy kết quả</div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1">
            {/* User button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hidden md:flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Tài khoản</span>
            </Button>

            {/* Mobile search button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-slate-900 z-50 pt-16">
          <div className="absolute right-4 top-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="container p-4">
            {/* Mobile search */}
            <div className="relative mb-8">
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-2" />
                <Input 
                  type="search" 
                  placeholder="Tìm cổ phiếu..." 
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </div>
              
              {/* Mobile Search Results */}
              {isSearchOpen && (
                <div className="mt-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-slate-800/20 max-h-[60vh] overflow-y-auto">
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
                        <li 
                          key={stock.id} 
                          className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => handleResultClick(stock.symbol)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-medium">
                                {stock.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{stock.symbol}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{stock.name}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{stock.exchange}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.length > 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">Không tìm thấy kết quả</div>
                  ) : null}
                </div>
              )}
            </div>
            
            {/* Mobile navigation links */}
            <nav className="space-y-4">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Trang chủ</MobileNavLink>
              <MobileNavLink href="/gioi-thieu" onClick={() => setIsMenuOpen(false)}>Giới thiệu</MobileNavLink>
              <MobileNavLink href="/tin-tuc" onClick={() => setIsMenuOpen(false)}>Tin tức</MobileNavLink>
              <MobileNavLink href="/lien-he" onClick={() => setIsMenuOpen(false)}>Liên hệ</MobileNavLink>
            </nav>
            
            {/* Mobile user button */}
            <div className="mt-8 pt-8 border-t dark:border-slate-700">
              <Button 
                variant="outline" 
                className="w-full justify-between items-center bg-transparent dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Đăng nhập / Đăng ký</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick} 
      className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      <span className="text-base font-medium">{children}</span>
      <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
    </Link>
  );
}
