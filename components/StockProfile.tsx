"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Building2, Info, BarChart3, BarChart4, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getFullStockProfile, StockProfile as StockProfileType } from "@/lib/services/stockService";

interface StockProfileProps {
  symbol?: string;
}

export default function StockProfile({ symbol = "VNINDEX" }: StockProfileProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockProfileType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFullStockProfile(symbol);
        setStockData(data);
      } catch (err) {
        setError("Không thể tải dữ liệu cổ phiếu. Vui lòng thử lại sau.");
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <section aria-labelledby="stock-info-heading">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-500 dark:text-gray-400">Đang tải thông tin cổ phiếu...</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error || !stockData) {
    return (
      <section aria-labelledby="stock-info-heading">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Info className="h-8 w-8 text-red-500" />
              <p className="text-red-500">{error || "Không tìm thấy dữ liệu cổ phiếu"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vui lòng kiểm tra lại mã cổ phiếu hoặc thử lại sau
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Check if profile exists
  if (!stockData.profile) {
    return (
      <section aria-labelledby="stock-info-heading">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Info className="h-8 w-8 text-red-500" />
              <p className="text-red-500">Dữ liệu chi tiết cổ phiếu chưa có sẵn</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vui lòng thử lại sau
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Determine if stock is up or down
  const isPositive = stockData.profile.profit > 0;

  return (
    <>
      {/* Section 1: Thông tin cổ phiếu */}
      <section aria-labelledby="stock-info-heading">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="space-y-7">
          {/* Stock Badge */}
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            <Building2 className="h-3 w-3 mr-1.5" />
            {stockData.exchange || "N/A"} • {stockData.industry || "N/A"}
          </div>

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 dark:text-white">
                {stockData.symbol}
              </h1>
              <div className="text-base mt-1 text-gray-500 dark:text-gray-400">
                {stockData.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold dark:text-white tracking-tight">{stockData.profile.price.toLocaleString()}</div>
              <div className={`flex items-center justify-end px-3 py-1 rounded-lg mt-1 ${isPositive ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">
                  {stockData.profile.profit !== undefined ? stockData.profile.profit.toFixed(2) : '0.00'}
                  {stockData.profile.price > 0 && stockData.profile.profit !== undefined && (
                    ` (${((stockData.profile.profit / (stockData.profile.price - stockData.profile.profit)) * 100).toFixed(2)}%)`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">Khối lượng</div>
                <BarChart3 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="text-lg font-semibold dark:text-white">{stockData.profile.volume !== undefined ? (stockData.profile.volume / 1000000).toFixed(2) : '0.00'}M</div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">P/E</div>
                <BarChart4 className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <div className="text-lg font-semibold dark:text-white">{stockData.profile.pe !== undefined ? stockData.profile.pe.toFixed(2) : 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">EPS</div>
                <BarChart3 className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="text-lg font-semibold dark:text-white">{stockData.profile.eps !== undefined ? stockData.profile.eps.toFixed(2) : 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">ROE</div>
                <BarChart4 className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div className="text-lg font-semibold dark:text-white">{stockData.profile.roe !== undefined ? stockData.profile.roe.toFixed(2) : 'N/A'}%</div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">ROA</div>
                <TrendingUp className="h-4 w-4 text-teal-500 dark:text-teal-400" />
              </div>
              <div className="text-lg font-semibold dark:text-white">{stockData.profile.roa !== undefined ? stockData.profile.roa.toFixed(2) : 'N/A'}%</div>
            </div>
          </div>

          {/* Description */}
          {stockData.description && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="mt-0.5 p-1.5 rounded-full bg-blue-100 dark:bg-blue-800/30">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{stockData.description}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
