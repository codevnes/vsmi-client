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
  const [timeRange, setTimeRange] = useState<'1m' | '6m' | '1y' | '5y'>('1m');
  const [stockData, setStockData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

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
    tooltip.style.padding = '4px 8px';
    tooltip.style.color = '#FFF';
    tooltip.style.fontSize = '11px';
    tooltip.style.borderRadius = '0';
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
      borderColor: '#2B2F36',
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
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320, // 60% of total height (approx.)
      timeScale: {
        visible: true,
        borderVisible: false,
      },
      rightPriceScale: commonPriceScaleOptions,
      localization: {
        priceFormatter: formatNumber,
      },
    });

    const indicatorChart = createChart(indicatorChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
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
    });

    const volumeChart = createChart(volumeChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 140, // 20% of total height (approx.)
      timeScale: {
        visible: true,
        borderVisible: true,
      },
      rightPriceScale: commonPriceScaleOptions,
      localization: {
        priceFormatter: formatNumber,
      },
    });

    // Add series to charts
    const mainSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
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
      color: '#2196F3',
      lineWidth: 2,
      title: 'TrendQ',
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
        color: item.fq >= 0 ? '#26a69a' : '#ef5350',
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
        color: item.close >= item.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
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

    // Enhanced crosshair move handler
    priceChart.subscribeCrosshairMove((param) => {
      if (param.time && tooltipRef.current) {
        indicatorChart.setCrosshairPosition(NaN, param.time, trendQSeries);
        volumeChart.setCrosshairPosition(NaN, param.time, volumeSeries);
        
        // Find the data point for the hovered time
        const dataPoint = stockData.find((item: ChartData) => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          const priceChangePercent = (priceChange / dataPoint.open * 100).toFixed(2);
          const changeColor = priceChange >= 0 ? '#26a69a' : '#ef5350';
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">+/-:</span>
                <span style="color:${changeColor}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)} (${priceChangePercent}%)</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">O/H/L:</span>
                <span>${dataPoint.open.toLocaleString()}/${dataPoint.high.toLocaleString()}/${dataPoint.low.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">KL:</span>
                <span>${(dataPoint.volume / 1000000).toFixed(1)}M</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        indicatorChart.clearCrosshairPosition();
        volumeChart.clearCrosshairPosition();
      }
    });

    indicatorChart.subscribeCrosshairMove((param) => {
      if (param.time && tooltipRef.current) {
        priceChart.setCrosshairPosition(NaN, param.time, mainSeries);
        volumeChart.setCrosshairPosition(NaN, param.time, volumeSeries);
        
        // Find the data point for the hovered time
        const dataPoint = stockData.find((item: ChartData) => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          const priceChangePercent = (priceChange / dataPoint.open * 100).toFixed(2);
          const changeColor = priceChange >= 0 ? '#26a69a' : '#ef5350';
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">+/-:</span>
                <span style="color:${changeColor}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)} (${priceChangePercent}%)</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">O/H/L:</span>
                <span>${dataPoint.open.toLocaleString()}/${dataPoint.high.toLocaleString()}/${dataPoint.low.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">KL:</span>
                <span>${(dataPoint.volume / 1000000).toFixed(1)}M</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        priceChart.clearCrosshairPosition();
        volumeChart.clearCrosshairPosition();
      }
    });

    volumeChart.subscribeCrosshairMove((param) => {
      if (param.time && tooltipRef.current) {
        priceChart.setCrosshairPosition(NaN, param.time, mainSeries);
        indicatorChart.setCrosshairPosition(NaN, param.time, trendQSeries);
        
        // Find the data point for the hovered time
        const dataPoint = stockData.find((item: ChartData) => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          const priceChangePercent = (priceChange / dataPoint.open * 100).toFixed(2);
          const changeColor = priceChange >= 0 ? '#26a69a' : '#ef5350';
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">+/-:</span>
                <span style="color:${changeColor}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)} (${priceChangePercent}%)</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">O/H/L:</span>
                <span>${dataPoint.open.toLocaleString()}/${dataPoint.high.toLocaleString()}/${dataPoint.low.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">KL:</span>
                <span>${(dataPoint.volume / 1000000).toFixed(1)}M</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        priceChart.clearCrosshairPosition();
        indicatorChart.clearCrosshairPosition();
      }
    });

    // Create time range buttons
    const buttons = document.createElement('div');
    buttons.className = 'time-range-buttons';
    buttons.style.position = 'absolute';
    buttons.style.top = '-1rem';
    buttons.style.display = 'flex';
    buttons.style.alignItems = 'center';
    buttons.style.gap = '4px';
    buttons.style.fontSize = '12px';
    buttons.style.fontWeight = 'bold';
    buttons.style.right = '10px';
    buttons.style.zIndex = '100';
    
    const createButton = (range: '1m' | '6m' | '1y' | '5y', text: string) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.padding = '5px 12px';
      button.style.border = 'none';
      button.style.borderRadius = '3px';
      button.style.background = range === timeRange ? '#2196F3' : '#2a2e39';
      button.style.color = '#FFF';
      button.style.cursor = 'pointer';
      button.style.transition = 'background 0.3s ease';
      button.addEventListener('click', () => {
        setTimeRange(range);
      });
      
      return button;
    };
    
    buttons.appendChild(createButton('1m', '1M'));
    buttons.appendChild(createButton('6m', '6M'));
    buttons.appendChild(createButton('1y', '1Y'));
    buttons.appendChild(createButton('5y', '5Y'));
    
    priceChartRef.current.appendChild(buttons);

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
  }, [isClient, stockData]);

  // Loading placeholder
  if (!isClient) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading chart...</div>
      </div>
    );
  }

  // Show loading or error states
  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading {symbol} data...</div>
      </div>
    );
  }
  return (
    <div className="w-full shadow-lg rounded-lg overflow-hidden bg-gray-900 p-4" ref={chartContainerRef}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold text-white">{symbol}</h2>
          {stockData.length > 0 && (
            <span className={`text-lg ${stockData[stockData.length-1].close > stockData[stockData.length-1].open ? 'text-green-500' : 'text-red-500'}`}>
              {stockData[stockData.length-1].close.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <div className="relative pt-4">
        <div ref={priceChartRef} className="w-full relative"/>
        <div ref={indicatorChartRef} className="w-full"/>
        <div ref={volumeChartRef} className="w-full" />
      </div>
    </div>
  );
} 