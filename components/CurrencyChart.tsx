'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  createChart, 
  ColorType, 
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  IChartApi,
} from 'lightweight-charts';
import { fetchCurrencies, fetchCurrencyPrices, mapCurrencyPricesToChartData } from '../services/currencyService';
import { Currency, CurrencyPrice } from '../types/currency';

// Define the data interface for currency chart data
interface CurrencyChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trendQ: number;
  fq: number;
}

// Define interface for currency pairs with metadata
interface CurrencyPairData {
  [key: string]: {
    data: CurrencyChartData[];
    label: string;
    description: string;
    color: string;
  };
}

export function CurrencyChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const priceChartRef = useRef<HTMLDivElement>(null);
  const indicatorChartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPairData>({});
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [currencyPair, setCurrencyPair] = useState<string>('AUD/USD');

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch available currencies
  useEffect(() => {
    async function loadCurrencies() {
      try {
        const response = await fetchCurrencies();
        if (response.success) {
          setAvailableCurrencies(response.data);
          
          // Set default currency pair if available
          if (response.data.length > 0 && !currencyPair) {
            setCurrencyPair(response.data[0].code);
          }
        } else {
          setError('Failed to load currencies');
        }
      } catch (err) {
        setError('Error fetching currencies');
        console.error(err);
      }
    }

    loadCurrencies();
  }, []);

  // Fetch currency pair data when selected pair changes
  useEffect(() => {
    if (!currencyPair) return;

    async function loadCurrencyData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchCurrencyPrices(currencyPair);
        
        if (response.success) {
          const chartData = mapCurrencyPricesToChartData(response.data);
          
          // Get currency name from available currencies
          const currencyInfo = availableCurrencies.find(c => c.code === currencyPair);
          const description = currencyInfo ? currencyInfo.name : currencyPair;
          
          // Assign a color based on currency code
          const colorMap: Record<string, string> = {
            'USD': '#4CAF50',
            'EUR': '#2196F3',
            'JPY': '#9C27B0',
            'GBP': '#FF9800'
          };
          
          const color = colorMap[currencyPair] || '#4CAF50';
          
          // Update currency pairs data
          setCurrencyPairs(prev => ({
            ...prev,
            [currencyPair]: {
              data: chartData,
              label: currencyPair,
              description,
              color
            }
          }));
        } else {
          setError('Failed to load currency data');
        }
      } catch (err) {
        setError('Error fetching currency data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrencyData();
  }, [currencyPair, availableCurrencies]);

  useEffect(() => {
    if (!isClient || 
      !chartContainerRef.current || 
      !priceChartRef.current || 
      !indicatorChartRef.current ||
      !currencyPairs[currencyPair]?.data?.length) return;

    // Clear previous charts
    priceChartRef.current.innerHTML = '';
    indicatorChartRef.current.innerHTML = '';

    // Create tooltip div
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = '0';
    tooltip.style.top = '-1rem';
    tooltip.style.padding = '8px 12px';
    tooltip.style.color = '#FFF';
    tooltip.style.fontSize = '12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '100';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.maxWidth = 'none';
    tooltip.style.width = 'fit-content';
    tooltip.style.backgroundColor = 'rgba(35, 38, 45, 0.85)';
    tooltip.style.backdropFilter = 'blur(4px)';
    tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    priceChartRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

    // Common price scale options
    const commonPriceScaleOptions = {
      borderVisible: true,
      borderColor: '#2B2F36',
      entireTextOnly: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    };

    // Create charts
    const priceChart = createChart(priceChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: commonPriceScaleOptions,
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 0,
        },
      },
    });

    const indicatorChart = createChart(indicatorChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 140,
      timeScale: {
        visible: true,
        borderVisible: true,
      },
      rightPriceScale: commonPriceScaleOptions,
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 0,
        },
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
      currencyPairs[currencyPair].data.map(item => ({
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
      currencyPairs[currencyPair].data.map(item => ({
        time: item.date,
        value: item.trendQ,
      }))
    );

    const fqSeries = indicatorChart.addSeries(HistogramSeries, {
      color: '#FF9800',
      title: 'FQ',
    });

    fqSeries.setData(
      currencyPairs[currencyPair].data.map(item => ({
        time: item.date,
        value: item.fq,
        color: item.fq >= 0 ? '#26a69a' : '#ef5350',
      }))
    );

    // Add legend text for the indicator chart
    const legendDiv = document.createElement('div');
    legendDiv.style.position = 'absolute';
    legendDiv.style.top = '5px';
    legendDiv.style.left = '10px';
    legendDiv.style.zIndex = '2';
    legendDiv.style.fontSize = '12px';
    legendDiv.style.display = 'flex';
    legendDiv.style.gap = '15px';
    
    const trendQLabel = document.createElement('div');
    trendQLabel.style.display = 'flex';
    trendQLabel.style.alignItems = 'center';
    trendQLabel.style.color = '#d1d4dc';
    
    const trendQColor = document.createElement('span');
    trendQColor.style.display = 'inline-block';
    trendQColor.style.width = '10px';
    trendQColor.style.height = '2px';
    trendQColor.style.backgroundColor = '#2196F3';
    trendQColor.style.marginRight = '5px';
    
    trendQLabel.appendChild(trendQColor);
    trendQLabel.appendChild(document.createTextNode('TrendQ'));
    
    const fqLabel = document.createElement('div');
    fqLabel.style.display = 'flex';
    fqLabel.style.alignItems = 'center';
    fqLabel.style.color = '#d1d4dc';
    
    const fqColorPos = document.createElement('span');
    fqColorPos.style.display = 'inline-block';
    fqColorPos.style.width = '8px';
    fqColorPos.style.height = '8px';
    fqColorPos.style.backgroundColor = '#26a69a';
    fqColorPos.style.marginRight = '5px';
    
    fqLabel.appendChild(fqColorPos);
    fqLabel.appendChild(document.createTextNode('FQ'));
    
    legendDiv.appendChild(trendQLabel);
    legendDiv.appendChild(fqLabel);
    
    indicatorChartRef.current.appendChild(legendDiv);

    // Sync the time scales
    priceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        indicatorChart.timeScale().setVisibleLogicalRange(range);
      }
    });

    indicatorChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        priceChart.timeScale().setVisibleLogicalRange(range);
      }
    });

    // Handle crosshair movement
    priceChart.subscribeCrosshairMove((param) => {
      if (param.time && tooltipRef.current) {
        indicatorChart.setCrosshairPosition(NaN, param.time, trendQSeries);
        
        // Find the data point for the hovered time
        const dataPoint = currencyPairs[currencyPair].data.find(item => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">+/-:</span>
                <span style="color:${priceChange >= 0 ? '#26a69a' : '#ef5350'}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(5)} (${(priceChange / dataPoint.open * 100).toFixed(2)}%)</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">O/H/L:</span>
                <span>${dataPoint.open.toLocaleString()}/${dataPoint.high.toLocaleString()}/${dataPoint.low.toLocaleString()}</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        indicatorChart.clearCrosshairPosition();
      }
    });

    indicatorChart.subscribeCrosshairMove((param) => {
      if (param.time && tooltipRef.current) {
        priceChart.setCrosshairPosition(NaN, param.time, mainSeries);
        
        // Find the data point for the hovered time
        const dataPoint = currencyPairs[currencyPair].data.find(item => item.date === param.time);
        
        if (dataPoint) {
          const priceChange = dataPoint.close - dataPoint.open;
          
          tooltipRef.current.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:center">
              <span style="font-weight:bold">${dataPoint.date}</span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">Đóng:</span>
                <span style="font-weight:bold">${dataPoint.close.toLocaleString()}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">TrendQ:</span>
                <span>${dataPoint.trendQ.toFixed(2)}</span>
              </span>
              <span style="display:flex;align-items:center;gap:4px">
                <span style="color:#999;font-size:10px">FQ:</span>
                <span style="color:${dataPoint.fq >= 0 ? '#26a69a' : '#ef5350'}">${dataPoint.fq.toFixed(2)}</span>
              </span>
            </div>
          `;
          tooltipRef.current.style.display = 'block';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
        priceChart.clearCrosshairPosition();
      }
    });

    // Set up resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        priceChart.applyOptions({ width });
        indicatorChart.applyOptions({ width });
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
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [isClient, currencyPair, currencyPairs]);

  // Loading placeholder
  if (!isClient || isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-card">
        <div className="text-muted-foreground">Đang tải biểu đồ...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-card">
        <div className="text-red-500">
          <p>Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // If no data available for the selected currency pair
  if (!currencyPairs[currencyPair]?.data?.length) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-card">
        <div className="text-muted-foreground">Không có dữ liệu cho cặp tiền tệ này</div>
      </div>
    );
  }

  // Get current currency pair info
  const currentPair = currencyPairs[currencyPair];
  const latestData = currentPair.data[currentPair.data.length - 1];
  const previousData = currentPair.data[currentPair.data.length - 2];
  const change = latestData.close - previousData.close;
  const changePercent = (change / previousData.close * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div className="w-full" ref={chartContainerRef}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mt-2">Tỷ Giá Hối Đoái</h3>
          <p className="text-sm text-muted-foreground mt-1">{currentPair.description}</p>
        </div>
        
        {/* Currency pair value display */}
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold">{latestData.close.toLocaleString()}</div>
          <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(5)} ({changePercent}%)
          </div>
        </div>
      </div>
      
      {/* Currency selector buttons in a grid layout */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {availableCurrencies.map((currency) => (
          <button
            key={currency.code}
            onClick={() => setCurrencyPair(currency.code)}
            className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all text-center ${
              currencyPair === currency.code 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            }`}
            title={currency.name}
          >
            {currency.code}
          </button>
        ))}
      </div>
      
      <div className="border rounded-lg p-4 bg-card/50 relative">
        <div className="relative pt-4">
          <div ref={priceChartRef} className="w-full relative"/>
          <div ref={indicatorChartRef} className="w-full mt-3"/>
        </div>
      </div>
    </div>
  );
} 