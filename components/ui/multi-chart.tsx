'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  createChart, 
  ColorType, 
  CandlestickSeries, 
  LineSeries, 
  HistogramSeries,
} from 'lightweight-charts';
import { fetchStockPrices, mapStockPricesToChartData } from '../../services/stockService';
import { useTheme } from 'next-themes';

// Define the data interface
interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trendQ: number;
  fq: number;
  volume: number;
  bandDown?: number;
  bandUp?: number;
}

// Format large numbers to abbreviated forms (1k, 1m, 1t)
const formatNumber = (price: number): string => {
  if (price === null || price === undefined) {
    return '';
  }
  
  // Limit to maximum 4 characters including suffix
  if (Math.abs(price) >= 1_000_000_000_000) {
    return (price / 1_000_000_000_000).toFixed(0) + 't';
  }
  
  if (Math.abs(price) >= 1_000_000_000) {
    return (price / 1_000_000_000).toFixed(0) + 'b';
  }
  
  if (Math.abs(price) >= 1_000_000) {
    return (price / 1_000_000).toFixed(0) + 'm';
  }
  
  if (Math.abs(price) >= 1_000) {
    return (price / 1_000).toFixed(0) + 'k';
  }
  
  // For smaller numbers, just truncate decimals
  if (Math.abs(price) >= 100) {
    return Math.round(price).toString();
  }
  
  if (Math.abs(price) >= 10) {
    return price.toFixed(1);
  }
  
  return price.toFixed(2);
};

// Define chart theme colors
interface ChartTheme {
  background: string;
  textColor: string;
  gridColor: string;
  borderColor: string;
  upColor: string;
  downColor: string;
  accentColor: string;
  volumeUpColor: string;
  volumeDownColor: string;
  tooltipBackground: string;
  tooltipTextColor: string;
  tooltipBorderColor: string;
  buttonActive: string;
  buttonInactive: string;
  buttonText: string;
}

const themes: Record<string, ChartTheme> = {
  light: {
    background: 'rgba(255, 255, 255, 0)',
    textColor: '#333333',
    gridColor: 'rgba(200, 200, 200, 0.3)',
    borderColor: 'rgba(200, 200, 200, 0.8)',
    upColor: '#089981',
    downColor: '#F23645',
    accentColor: '#2962FF',
    volumeUpColor: 'rgba(8, 153, 129, 0.5)',
    volumeDownColor: 'rgba(242, 54, 69, 0.5)',
    tooltipBackground: 'rgba(255, 255, 255, 0.9)',
    tooltipTextColor: '#333333',
    tooltipBorderColor: 'rgba(200, 200, 200, 0.8)',
    buttonActive: '#2962FF',
    buttonInactive: '#f1f5f9',
    buttonText: '#333333',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0)',
    textColor: '#d1d4dc',
    gridColor: 'rgba(42, 46, 57, 0.6)',
    borderColor: 'rgba(50, 50, 50, 0.8)',
    upColor: '#26a69a',
    downColor: '#ef5350',
    accentColor: '#2196F3',
    volumeUpColor: 'rgba(38, 166, 154, 0.5)',
    volumeDownColor: 'rgba(239, 83, 80, 0.5)',
    tooltipBackground: 'rgba(30, 30, 30, 0.95)',
    tooltipTextColor: '#d1d4dc',
    tooltipBorderColor: 'rgba(60, 60, 60, 0.8)',
    buttonActive: '#2196F3',
    buttonInactive: '#2a2e39',
    buttonText: '#FFF',
  },
};

interface MultiChartViewProps {
  symbol?: string;
}

export function MultiChartView({ symbol = 'VIC' }: MultiChartViewProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<HTMLDivElement>(null);
  const indicatorChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [timeRange, setTimeRange] = useState<'1m' | '6m' | '1y' | '5y'>('5y');
  const [stockData, setStockData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme: currentTheme = 'dark', systemTheme } = useTheme();
  
  // Determine active theme 
  const effectiveTheme = currentTheme === 'system' ? systemTheme || 'dark' : currentTheme;
  const themeColors = themes[effectiveTheme === 'dark' ? 'dark' : 'light'];

  // Determine date range based on timeRange
  const getDateRange = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    
    switch (timeRange) {
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate
    };
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { startDate, endDate } = getDateRange();
      
      const response = await fetchStockPrices(symbol, {
        startDate,
        endDate,
        sortDirection: 'asc', // Older to newer for charts
        limit: 0 // Get all data
      });
      
      if (response.success && response.data.stockPrices.length > 0) {
        const chartData = mapStockPricesToChartData(response.data.stockPrices);
        setStockData(chartData);
      } else {
        setStockData([]);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data when symbol or timeRange changes
  useEffect(() => {
    if (isClient) {
      fetchData();
    }
  }, [isClient, symbol, timeRange]);


  useEffect(() => {
    if (!isClient || 
      !chartContainerRef.current || 
      !priceChartRef.current || 
      !indicatorChartRef.current || 
      !volumeChartRef.current || 
      stockData.length === 0) return;

    // Clear previous charts
    priceChartRef.current.innerHTML = '';
    indicatorChartRef.current.innerHTML = '';
    volumeChartRef.current.innerHTML = '';

    // Create tooltip div
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = '0';
    tooltip.style.top = '-1rem';
    tooltip.style.padding = '8px 12px';
    tooltip.style.color = themeColors.tooltipTextColor;
    tooltip.style.fontSize = '12px';
    tooltip.style.fontWeight = '500';
    tooltip.style.borderRadius = '4px';
    tooltip.style.background = themeColors.tooltipBackground;
    tooltip.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    tooltip.style.border = `1px solid ${themeColors.tooltipBorderColor}`;
    tooltip.style.zIndex = '100';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.maxWidth = 'none';
    tooltip.style.width = 'fit-content';
    priceChartRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

    // Common price scale options for consistent width
    const commonPriceScaleOptions = {
      borderVisible: true,
      borderColor: themeColors.borderColor,
      entireTextOnly: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      minimumWidth: 60,
    };

    // Create charts
    const priceChart = createChart(priceChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: themeColors.background },
        textColor: themeColors.textColor,
        attributionLogo: false,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: themeColors.gridColor },
        horzLines: { color: themeColors.gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320, // 60% of total height (approx.)
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        borderColor: themeColors.borderColor,
      },
      rightPriceScale: commonPriceScaleOptions,
      localization: {
        priceFormatter: formatNumber,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
        horzLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
    });

    const indicatorChart = createChart(indicatorChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: themeColors.background },
        textColor: themeColors.textColor,
        attributionLogo: false,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: themeColors.gridColor },
        horzLines: { color: themeColors.gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 140, // 20% of total height (approx.)
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: commonPriceScaleOptions,
      localization: {
        priceFormatter: formatNumber,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
        horzLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
      },
    });

    const volumeChart = createChart(volumeChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: themeColors.background },
        textColor: themeColors.textColor,
        attributionLogo: false,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: themeColors.gridColor },
        horzLines: { color: themeColors.gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 140, // 20% of total height (approx.)
      timeScale: {
        visible: true,
        borderVisible: true,
        borderColor: themeColors.borderColor,
      },
      rightPriceScale: commonPriceScaleOptions,
      localization: {
        priceFormatter: formatNumber,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
        horzLine: {
          color: themeColors.accentColor + '80',
          width: 1,
          style: 1,
          labelBackgroundColor: themeColors.accentColor,
        },
      },
    });

    // Add series to charts
    const mainSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: themeColors.upColor,
      downColor: themeColors.downColor,
      borderVisible: false,
      wickUpColor: themeColors.upColor,
      wickDownColor: themeColors.downColor,
    });
    
    mainSeries.setData(
      stockData.map((item: ChartData) => ({
        time: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );

    const trendQSeries = indicatorChart.addSeries(LineSeries, {
      color: themeColors.accentColor,
      lineWidth: 2,
      title: 'TrendQ',
      lastPriceAnimation: 1,
    });

    trendQSeries.setData(
      stockData.map((item: ChartData) => ({
        time: item.date,
        value: item.trendQ,
      }))
    );

    const fqSeries = indicatorChart.addSeries(HistogramSeries, {
      color: '#FF9800',
      title: 'FQ',
    });

    fqSeries.setData(
      stockData.map((item: ChartData) => ({
        time: item.date,
        value: item.fq,
        color: item.fq >= 0 ? themeColors.upColor : themeColors.downColor,
      }))
    );
    
    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      color: '#8E24AA',
      title: 'Volume',
    });

    volumeSeries.setData(
      stockData.map((item: ChartData) => ({
        time: item.date,
        value: item.volume,
        color: item.close >= item.open ? themeColors.volumeUpColor : themeColors.volumeDownColor,
      }))
    );

    // Sync the time scales
    priceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        indicatorChart.timeScale().setVisibleLogicalRange(range);
        volumeChart.timeScale().setVisibleLogicalRange(range);
      }
    });

    indicatorChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        priceChart.timeScale().setVisibleLogicalRange(range);
        volumeChart.timeScale().setVisibleLogicalRange(range);
      }
    });

    volumeChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        priceChart.timeScale().setVisibleLogicalRange(range);
        indicatorChart.timeScale().setVisibleLogicalRange(range);
      }
    });

    // Enhanced crosshair move handler with unified tooltip
    const updateTooltip = (param: any, chart: any) => {
      if (param.time && tooltipRef.current) {
        // Sync crosshair on all charts
        if (chart !== priceChart) priceChart.setCrosshairPosition(NaN, param.time, mainSeries);
        if (chart !== indicatorChart) indicatorChart.setCrosshairPosition(NaN, param.time, trendQSeries);
        if (chart !== volumeChart) volumeChart.setCrosshairPosition(NaN, param.time, volumeSeries);
        
        // Find the data point for the hovered time
        const dataPoint = stockData.find((item: ChartData) => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          const priceChangePercent = (priceChange / dataPoint.open * 100).toFixed(2);
          const changeColor = priceChange >= 0 ? themeColors.upColor : themeColors.downColor;
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:6px">
                <span style="color:${effectiveTheme === 'dark' ? '#999' : '#666'};font-size:11px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:6px">
                <span style="color:${effectiveTheme === 'dark' ? '#999' : '#666'};font-size:11px">+/-:</span>
                <span style="color:${changeColor};font-weight:bold">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)} (${priceChangePercent}%)</span>
              </span>
              <span style="display:flex;align-items:center;gap:6px">
                <span style="color:${effectiveTheme === 'dark' ? '#999' : '#666'};font-size:11px">O/H/L:</span>
                <span>${dataPoint.open.toLocaleString()}/${dataPoint.high.toLocaleString()}/${dataPoint.low.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:6px">
                <span style="color:${effectiveTheme === 'dark' ? '#999' : '#666'};font-size:11px">KL:</span>
                <span style="font-weight:bold">${(dataPoint.volume / 1000000).toFixed(1)}M</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        priceChart.clearCrosshairPosition();
        indicatorChart.clearCrosshairPosition();
        volumeChart.clearCrosshairPosition();
      }
    };

    priceChart.subscribeCrosshairMove((param) => updateTooltip(param, priceChart));
    indicatorChart.subscribeCrosshairMove((param) => updateTooltip(param, indicatorChart));
    volumeChart.subscribeCrosshairMove((param) => updateTooltip(param, volumeChart));

    // Set up resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        priceChart.applyOptions({ width });
        indicatorChart.applyOptions({ width });
        volumeChart.applyOptions({ width });
      }
    };

    window.addEventListener('resize', handleResize);

    // Fit content
    priceChart.timeScale().fitContent();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      priceChart.remove();
      indicatorChart.remove();
      volumeChart.remove();
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [isClient, stockData, effectiveTheme]);

  const containerClass = `w-full rounded-lg overflow-hidden ${
    effectiveTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
  } transition-colors duration-200 p-4`;

  const textClass = effectiveTheme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextClass = effectiveTheme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  // Loading placeholder
  if (!isClient) {
    return (
      <div className={`w-full h-[600px] flex items-center justify-center ${effectiveTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={textClass}>Loading chart...</div>
      </div>
    );
  }

  // Show loading or error states
  if (loading) {
    return (
      <div className={`w-full h-[600px] flex items-center justify-center ${effectiveTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={textClass}>Loading {symbol} data...</div>
      </div>
    );
  }
  
  return (
    <div className={containerClass} ref={chartContainerRef}>
      <div className="mb-6 flex justify-between items-center">
        <div className="block md:flex items-baseline gap-3">
          <h2 className={`text-2xl font-bold ${textClass}`}>{symbol}</h2>
          {stockData.length > 0 && (
            <div className="flex flex-col">
              <span className={`text-lg font-semibold ${stockData[stockData.length-1].close > stockData[stockData.length-1].open ? 'text-green-500' : 'text-red-500'}`}>
                {stockData[stockData.length-1].close.toLocaleString()}
              </span>
              <span className={`text-xs ${mutedTextClass}`}>Cập nhật: {stockData[stockData.length-1].date}</span>
              <span className={`text-xs ${mutedTextClass} flex items-center gap-1`}>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                Chỉ số phân tích <span className={`font-bold ${effectiveTheme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>{symbol}</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => setTimeRange('1m')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeRange === '1m' 
                ? (effectiveTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') + ' text-white transform scale-105'
                : (effectiveTheme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            1M
          </button>
          <button 
            onClick={() => setTimeRange('6m')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeRange === '6m' 
                ? (effectiveTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') + ' text-white transform scale-105'
                : (effectiveTheme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            6M
          </button>
          <button 
            onClick={() => setTimeRange('1y')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeRange === '1y' 
                ? (effectiveTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') + ' text-white transform scale-105'
                : (effectiveTheme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            1Y
          </button>
          <button 
            onClick={() => setTimeRange('5y')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              timeRange === '5y' 
                ? (effectiveTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500') + ' text-white transform scale-105'
                : (effectiveTheme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            5Y
          </button>
        </div>
      </div>
      <div className="relative">
        <div ref={priceChartRef} className="w-full relative"/>
        <div ref={indicatorChartRef} className="w-full"/>
        <div ref={volumeChartRef} className="w-full" />
      </div>
    </div>
  );
} 