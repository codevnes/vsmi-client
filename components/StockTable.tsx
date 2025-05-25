"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Stock, PriceHistory } from "@/types/stock";
import { fetchSelectedStocksWithPriceHistory } from "@/services/stockService";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function StockTable() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const stocksData = await fetchSelectedStocksWithPriceHistory();
        setStocks(stocksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching stocks:', err);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  const formatPrice = (price: number) => {
    return (price / 1000).toFixed(2); // Converting from VND to display format
  };

  const formatChange = (returnValue: number | null) => {
    if (returnValue === null) return '0.00';
    return returnValue > 0 ? `+${returnValue.toFixed(2)}` : returnValue.toFixed(2);
  };

  const formatPercent = (returnValue: number | null) => {
    if (returnValue === null) return '0.00%';
    return `${returnValue > 0 ? '+' : ''}${returnValue.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('vi-VN').format(volume);
  };

  // Format data for miniature candlestick chart
  const getMiniCandlestickData = (priceHistory: PriceHistory[]) => {
    if (!priceHistory || priceHistory.length === 0) {
      return [{ 
        data: [
          { x: new Date().getTime(), y: [0, 0, 0, 0] }
        ]
      }];
    }
    
    // Only use the last 30 days of data to avoid overcrowding
    const recentData = priceHistory.slice(-30);
    
    return [{
      data: recentData.map(item => ({
        x: new Date(item.date).getTime(),
        y: [item.open, item.high, item.low, item.close]
      }))
    }];
  };

  // Configure miniature candlestick chart options
  const getMiniCandlestickOptions = (isPositive: boolean) => {
    return {
      chart: {
        type: 'candlestick' as const,
        height: 30,
        width: 120,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        animations: {
          enabled: false
        },
        background: 'transparent',
        sparkline: {
          enabled: true
        }
      },
      grid: {
        show: false
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        crosshairs: {
          show: false
        }
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#10b981', // Green for up candles
            downward: '#ef4444' // Red for down candles
          },
          wick: {
            useFillColor: true
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none'
          }
        },
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  };

  if (loading) {
    return <div className="text-center p-4 dark:text-white text-slate-900">Loading stocks data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  if (!stocks || stocks.length === 0) {
    return <div className="text-center p-4 dark:text-white text-slate-900">No stock data available</div>;
  }

  return (
    <Table>
      <TableHeader className="font-semibold bg-orange-200">
        <TableRow>
          <TableHead className="">Mã CK</TableHead>
          {!isMobile && <TableHead className="text-right">Giá</TableHead>}
          {!isMobile && <TableHead className="text-right">+/-</TableHead>}
          <TableHead className="text-right">%</TableHead>
          <TableHead className="text-right">Tổng KL</TableHead>
          {!isMobile && <TableHead className="text-right">Biểu đồ</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.symbol} className="border-b dark:border-slate-800 border-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
            <TableCell className="py-4">
              <Link href={`/stock/${stock.symbol}`} className="flex flex-col hover:opacity-80">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  <span className="font-bold dark:text-white text-slate-900">{stock.symbol}</span>
                </div>
                <div className="text-xs mt-1 line-clamp-1">{stock.stockName}</div>
              </Link>
            </TableCell>
            {!isMobile && (
              <TableCell className="text-right font-medium dark:text-white text-slate-900">
                {formatPrice(stock.latestSelectedStocks.close)}
              </TableCell>
            )}
            {!isMobile && (
              <TableCell className={`text-right font-medium ${(stock.latestSelectedStocks.return || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {formatChange(stock.latestSelectedStocks.return)}
              </TableCell>
            )}
            <TableCell className={`text-right font-medium ${(stock.latestSelectedStocks.return || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatPercent(stock.latestSelectedStocks.return)}
            </TableCell>
            <TableCell className="text-right font-medium dark:text-white text-slate-900">
              {formatVolume(stock.latestSelectedStocks.volume)}
            </TableCell>
            {!isMobile && (
              <TableCell className="text-right">
                <Link href={`/stock/${stock.symbol}`} className="block h-full w-fit m-auto mr-0 hover:opacity-80">
                  {typeof window !== 'undefined' && (
                    <div style={{ width: '120px', height: '30px' }}>
                      {stock.priceHistory && stock.priceHistory.length > 0 ? (
                        <ReactApexChart
                          options={getMiniCandlestickOptions((stock.latestSelectedStocks.return || 0) >= 0)}
                          series={getMiniCandlestickData(stock.priceHistory)}
                          type="candlestick"
                          height={30}
                          width={120}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          No data
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 