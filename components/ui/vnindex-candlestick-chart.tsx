'use client';

import { useEffect, useRef, useState } from 'react';
import { CandlestickSeries, ColorType, createChart, CrosshairMode, Time } from 'lightweight-charts';
import { Button } from '@/components/ui/button';

// Demo data generator for VNINDEX candlestick
const generateCandlestickDemoData = (days: number, startPrice: number, volatility: number, seed = 42) => {
  // Use a seeded random number generator for consistent results
  const seededRandom = (max: number, min = 0) => {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    return min + rnd * (max - min);
  };
  
  const data = [];
  const date = new Date();
  date.setDate(date.getDate() - days);
  let price = startPrice;
  
  for (let i = 0; i < days; i++) {
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
      continue;
    }
    
    // Random price movement
    const change = (seededRandom(1) - 0.5) * volatility;
    const closePrice = price * (1 + change);
    
    // Add some market trends based on time periods
    let trendFactor = 1.0;
    if (i < days / 3) {
      trendFactor = 1.001; // Slight uptrend
    } else if (i < days * 2 / 3) {
      trendFactor = 0.999; // Slight downtrend
    } else {
      trendFactor = 1.002; // Recovery
    }
    
    const dailyVolatility = volatility * 0.5;
    const open = price;
    const close = closePrice * trendFactor;
    const high = Math.max(open, close) * (1 + seededRandom(dailyVolatility));
    const low = Math.min(open, close) * (1 - seededRandom(dailyVolatility));
    
    const formattedDate = date.toISOString().split('T')[0];
    
    data.push({
      time: formattedDate as Time,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2)
    });
    
    // Update price for next day
    price = close;
    date.setDate(date.getDate() + 1);
  }
  
  return data;
};

type TimeRange = '1m' | '6m' | '1y' | '5y';

// Generate demo data once outside the component to avoid regeneration
const chartData = {
  '1m': generateCandlestickDemoData(30, 1200, 0.01),
  '6m': generateCandlestickDemoData(180, 1150, 0.015),
  '1y': generateCandlestickDemoData(365, 1100, 0.02),
  '5y': generateCandlestickDemoData(365 * 5, 800, 0.025),
};

export function VNIndexCandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1m');
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!chartContainerRef.current || !isClient) return;
    
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    // Set data based on selected range
    candlestickSeries.setData(chartData[selectedRange]);
    
    // Fit content
    chart.timeScale().fitContent();
    
    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [selectedRange, isClient]);
  
  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };
  
  // Initial render placeholder
  if (!isClient) {
    return (
      <div className="bg-card rounded-lg p-4 w-full">
        <div className="h-[400px] flex items-center justify-center">
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">VNINDEX</h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedRange === '1m' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRangeChange('1m')}
          >
            1M
          </Button>
          <Button 
            variant={selectedRange === '6m' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRangeChange('6m')}
          >
            6M
          </Button>
          <Button 
            variant={selectedRange === '1y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRangeChange('1y')}
          >
            1Y
          </Button>
          <Button 
            variant={selectedRange === '5y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRangeChange('5y')}
          >
            5Y
          </Button>
        </div>
      </div>
      <div className="rounded-md overflow-hidden">
        <div ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  );
} 