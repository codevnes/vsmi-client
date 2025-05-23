"use client"

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fetchFinancialMetrics } from '@/services/stockService';
import { FinancialMetricsQueryParams } from '@/types/financialMetrics';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function TechnicalAnalysisCharts(props: { symbol: string }) {
  const { symbol } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'quarter' | 'year'>('quarter');
  const [chartData, setChartData] = useState<any>(null);
  const [rawData, setRawData] = useState<any>(null);
  
  // Always use dark mode

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params: FinancialMetricsQueryParams = {
          type: activeView,
          page: 1,
          limit: 20
        };
        
        const response = await fetchFinancialMetrics(symbol, params);
        setRawData(response);
        
        // Manual mapping for better control
        const mappedData = mapDataManually(response);
        setChartData(mappedData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, activeView]);

  // Custom function to map data correctly
  const mapDataManually = (data: any) => {
    // Check if the data structure is valid
    if (!data || !data.data || !data.data.records || !Array.isArray(data.data.records)) {
      return {
        eps: [],
        performance: [],
        revenue: [],
        financial: [],
        pe: []
      };
    }
    
    const { records } = data.data;
    const isQuarterly = data.data.type === 'quarter';
    
    if (isQuarterly) {
      const quarterlyData = {
        eps: records.map((record: any) => ({
          quarter: `Q${record.quarter}/${record.year}`,
          eps: record.eps,
        })).reverse(),
        
        performance: records.map((record: any) => ({
          quarter: `Q${record.quarter}/${record.year}`,
          roa: record.roa * 100, // Convert to percentage
          roe: record.roe * 100, // Convert to percentage
        })).reverse(),
        
        revenue: records.map((record: any) => ({
          quarter: `Q${record.quarter}/${record.year}`,
          revenue: record.revenue, 
          margin: record.margin, 
        })).reverse(),
        
        financial: records.map((record: any) => ({
          quarter: `Q${record.quarter}/${record.year}`,
          debt: record.totalDebtToEquity,
          assets: record.totalAssetsToEquity,
        })).reverse(),
        
        pe: [] // Empty array for quarterly view
      };
      
      return quarterlyData;
    } else {
      const yearlyData = {
        eps: records.map((record: any) => ({
          year: record.year.toString(),
          eps: record.eps,
          epsIndustry: record.epsIndustry || 0
        })).reverse(),
        
        pe: records.map((record: any) => ({
          year: record.year.toString(),
          pe: record.pe || 0,
          peIndustry: record.peIndustry || 0
        })).reverse(),
        
        performance: records.map((record: any) => ({
          year: record.year.toString(),
          roa: record.roa * 100, // Convert to percentage
          roe: record.roe * 100, // Convert to percentage
          roaIndustry: record.roaIndustry ? record.roaIndustry * 100 : 0, // Convert to percentage
          roeIndustry: record.roeIndustry ? record.roeIndustry * 100 : 0, // Convert to percentage
        })).reverse(),
        
        financial: records.map((record: any) => ({
          year: record.year.toString(),
          debt: record.totalDebtToEquity,
          assets: record.totalAssetsToEquity,
        })).reverse(),
        
        revenue: [] // Empty array for yearly view
      };
      
      return yearlyData;
    }
  };

  // Shared chart options for all charts
  const commonOptions = {
    chart: {
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',

      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.1
      },
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as 'dark' | 'light',
      palette: 'palette1'
    },
    grid: {
      borderColor: '#2d3748',
      strokeDashArray: 3,
      row: {
        colors: ['#1a2234', '#1e293b'],
        opacity: 0.5
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      x: {
        show: true,
      },
      y: {
        formatter: function(val: number, opts?: any) {
          // Format differently based on series name or index
          if (opts?.seriesIndex === 1 && opts?.w.config.series[1].name.includes('Biên')) {
            return (val * 100).toFixed(2) + '%';
          } else if (opts?.w.config.series[opts?.seriesIndex].name.includes('ROA') || 
                    opts?.w.config.series[opts?.seriesIndex].name.includes('ROE')) {
            return val.toFixed(2) + '%';
          } else if (opts?.w.config.series[opts?.seriesIndex].name.includes('Doanh thu')) {
            return (val / 1000000000).toFixed(2) + ' tỷ';
          } else {
            return val.toFixed(2);
          }
        }
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
      offsetY: -5,
      offsetX: 0,
      floating: false,
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: '#e2e8f0',
        useSeriesColors: false
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      markers: {
        width: 10,
        height: 10,
        strokeWidth: 0,
        radius: 5,
        offsetX: 0,
        offsetY: 0
      },
      formatter: function(seriesName: string, opts: any) {
        return seriesName;
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten' as const,
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken' as const,
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '65%',
        distributed: false,
        rangeBarOverlap: true,
        rangeBarGroupRows: false,
        colors: {
          ranges: [],
          backgroundBarColors: [],
          backgroundBarOpacity: 0.1,
        },
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: true,
        }
      }
    },
    fill: {
      opacity: 1,
      type: 'solid',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: [],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 85, 100]
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px'
        },
        trim: true,
        rotate: -45,
        hideOverlappingLabels: true
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px'
        },
        formatter: function(val: number) {
          if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K';
          } else if (val >= 1000000) {
            return (val / 1000000).toFixed(1) + 'M';
          } else {
            return val.toFixed(1);
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '10px',
        colors: ['#fff']
      },
      background: {
        enabled: true,
        foreColor: '#1a2234',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#2d3748',
        opacity: 0.9,
      },
      dropShadow: {
        enabled: false
      },
      offsetY: -20,
      formatter: function(val: number, opts?: any) {
        if (val >= 1000) {
          return (val / 1000).toFixed(1) + 'K';
        } else if (val >= 1000000) {
          return (val / 1000000).toFixed(1) + 'M';
        } else if (typeof val === 'number') {
          return val.toFixed(1);
        }
        return val;
      }
    },
    stroke: {
      width: [0, 2],
      curve: 'smooth' as 'smooth' | 'straight' | 'stepline',
      lineCap: 'round' as 'round' | 'butt' | 'square',
      colors: undefined
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300
          }
        }
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 250
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '11px',
          }
        }
      }
    ]
  };

  // Render quarterly charts
  const renderQuarterlyCharts = () => {
    if (!chartData || isLoading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-slate-300">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    // Ensure all required data arrays exist
    const epsData = chartData.eps || [];
    const performanceData = chartData.performance || [];
    const revenueData = chartData.revenue || [];
    const financialData = chartData.financial || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Chart 1: EPS Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Lãi cơ bản trên cổ phiếu (EPS)</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 1,
                  blur: 4,
                  opacity: 0.2,
                  color: '#38bdf8'
                }
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: epsData.map((item: any) => item.quarter || ''),
                title: {
                  text: 'Quý',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'EPS (VND)',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    if (val >= 1000) {
                      return (val / 1000).toFixed(1) + 'K';
                    }
                    return val.toFixed(1);
                  }
                }
              },
              colors: ['#6366f1'],
              dataLabels: {
                ...commonOptions.dataLabels,
                formatter: function(val: number) {
                  if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                  }
                  return val.toFixed(1);
                }
              },
              plotOptions: {
                ...commonOptions.plotOptions,
                bar: {
                  ...commonOptions.plotOptions.bar,
                  borderRadius: 0,
                  columnWidth: '60%',
                }
              }
            }}
            series={[
              {
                name: 'EPS',
                data: epsData.map((item: any) => item.eps || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>

        {/* Chart 2: ROA/ROE Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Hiệu suất sinh lời (ROA/ROE)</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 1,
                  blur: 5,
                  opacity: 0.2,
                  color: '#10b981'
                }
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: performanceData.map((item: any) => item.quarter || ''),
                title: {
                  text: 'Quý',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'Tỷ lệ (%)',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    return val.toFixed(1) + '%';
                  }
                }
              },
              colors: ['#06b6d4', '#fcd34d'],
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    return val.toFixed(2) + '%';
                  }
                }
              }
            }}
            series={[
              {
                name: 'ROA',
                data: performanceData.map((item: any) => item.roa || 0)
              },
              {
                name: 'ROE',
                data: performanceData.map((item: any) => item.roe || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>

        {/* Chart 3: Revenue & Margin Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Doanh thu và biên lợi nhuận</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'line',
                height: 350,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 1,
                  blur: 5,
                  opacity: 0.2,
                  color: '#e11d48'
                }
              },
              stroke: {
                width: [0, 3],
                curve: 'smooth',
                colors: undefined
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: revenueData.map((item: any) => item.quarter || ''),
                title: {
                  text: 'Quý',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: [
                {
                  ...commonOptions.yaxis,
                  title: {
                    text: 'Doanh thu (tỷ VND)',
                    style: {
                      fontSize: '13px',
                      color: '#e2e8f0'
                    }
                  },
                  labels: {
                    ...commonOptions.yaxis.labels,
                    formatter: function(val: number) {
                      if (val >= 1000) {
                        return (val / 1000).toFixed(1) + 'K';
                      }
                      return val.toFixed(1);
                    }
                  }
                },
                {
                  opposite: true,
                  title: {
                    text: 'Biên lợi nhuận (%)',
                    style: {
                      fontSize: '13px',
                      color: '#e2e8f0'
                    }
                  },
                  labels: {
                    style: {
                      colors: '#e2e8f0',
                      fontSize: '12px'
                    },
                    formatter: function(val: number) {
                      return (val * 100).toFixed(1) + '%';
                    }
                  },
                  min: 0,
                  max: function(max: number) {
                    return Math.max(max * 1.2, 0.5);
                  }
                }
              ],
              colors: ['#f43f5e', '#a855f7'],
              markers: {
                size: [0, 5],
                strokeColors: '#1a2234',
                strokeWidth: 2,
                hover: {
                  size: 7
                }
              },
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number, opts?: any) {
                    if (opts.seriesIndex === 0) {
                      return (val / 1000000000).toFixed(2) + ' tỷ';
                    } else {
                      return (val * 100).toFixed(2) + '%';
                    }
                  }
                }
              }
            }}
            series={[
              {
                name: 'Doanh thu',
                type: 'column',
                data: revenueData.map((item: any) => item.revenue || 0)
              },
              {
                name: 'Biên lợi nhuận',
                type: 'line',
                data: revenueData.map((item: any) => item.margin || 0)
              }
            ]}
            type="line"
            height={350}
          />
        </div>

        {/* Chart 4: Financial Ratios */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Tỷ lệ tài chính</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 1,
                  blur: 5,
                  opacity: 0.2,
                  color: '#7c3aed'
                }
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: financialData.map((item: any) => item.quarter || ''),
                title: {
                  text: 'Quý',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'Hệ số',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    return val.toFixed(1);
                  }
                }
              },
              colors: ['#0ea5e9', '#8b5cf6'],
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    return val.toFixed(2);
                  }
                }
              }
            }}
            series={[
              {
                name: 'Nợ / Vốn chủ sở hữu',
                data: financialData.map((item: any) => item.debt || 0)
              },
              {
                name: 'Tổng tài sản / Vốn chủ sở hữu',
                data: financialData.map((item: any) => item.assets || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>
      </div>
    );
  };

  // Render yearly charts with similar professional design
  const renderYearlyCharts = () => {
    if (!chartData || isLoading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-slate-300">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    // Ensure all required data arrays exist
    const epsData = chartData.eps || [];
    const peData = chartData.pe || [];
    const performanceData = chartData.performance || [];
    const financialData = chartData.financial || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Chart 1: EPS & Industry EPS Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Lãi cơ bản trên cổ phiếu (EPS)</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: epsData.map((item: any) => item.year || ''),
                title: {
                  text: 'Năm',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'EPS (VND)',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    if (val >= 1000) {
                      return (val / 1000).toFixed(1) + 'K';
                    }
                    return val.toFixed(1);
                  }
                }
              },
              colors: ['#38bdf8', '#4ade80'],
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    if (val >= 1000) {
                      return (val / 1000).toFixed(2) + 'K';
                    }
                    return val.toFixed(2);
                  }
                }
              }
            }}
            series={[
              {
                name: 'EPS',
                data: epsData.map((item: any) => item.eps || 0)
              },
              {
                name: 'EPS Ngành',
                data: epsData.map((item: any) => item.epsIndustry || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>

        {/* Chart 2: PE & Industry PE Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Chỉ số P/E</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: peData.map((item: any) => item.year || ''),
                title: {
                  text: 'Năm',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'Chỉ số P/E',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    if (val > 100) {
                      return (val / 100).toFixed(1) + '×100';
                    }
                    return val.toFixed(1);
                  }
                }
              },
              colors: ['#f43f5e', '#a855f7'],
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    return val.toFixed(2);
                  }
                }
              }
            }}
            series={[
              {
                name: 'P/E',
                data: peData.map((item: any) => item.pe || 0)
              },
              {
                name: 'P/E Ngành',
                data: peData.map((item: any) => item.peIndustry || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>

        {/* Chart 3: ROA/ROE & Industry Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Hiệu suất sinh lời</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'line',
                stacked: false,
                height: 350,
              },
              stroke: {
                width: [0, 0, 3, 3],
                curve: 'smooth' as 'smooth',
                dashArray: [0, 0, 0, 0],
                lineCap: 'round' as 'round' | 'butt' | 'square'
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: performanceData.map((item: any) => item.year || ''),
                title: {
                  text: 'Năm',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'Tỷ lệ (%)',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    return val.toFixed(1) + '%';
                  }
                }
              },
              colors: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
              plotOptions: {
                ...commonOptions.plotOptions,
                bar: {
                  ...commonOptions.plotOptions.bar,
                  columnWidth: '35%', // Narrower columns to reduce clutter
                }
              },
              markers: {
                size: [0, 0, 5, 5],
                strokeColors: '#1a2234',
                strokeWidth: 2,
                hover: {
                  size: 7
                }
              },
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    return val.toFixed(2) + '%';
                  }
                }
              }
            }}
            series={[
              {
                name: 'ROA',
                type: 'column',
                data: performanceData.map((item: any) => item.roa || 0)
              },
              {
                name: 'ROE',
                type: 'column',
                data: performanceData.map((item: any) => item.roe || 0)
              },
              {
                name: 'ROA Ngành',
                type: 'line',
                data: performanceData.map((item: any) => item.roaIndustry || 0)
              },
              {
                name: 'ROE Ngành',
                type: 'line',
                data: performanceData.map((item: any) => item.roeIndustry || 0)
              }
            ]}
            type="line"
            height={350}
          />
        </div>

        {/* Chart 4: Financial Ratios Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-slate-200">Tỷ lệ tài chính</h3>
          <ReactApexChart 
            options={{
              ...commonOptions,
              chart: {
                ...commonOptions.chart,
                type: 'bar',
                height: 350,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 1,
                  blur: 5,
                  opacity: 0.2,
                  color: '#ec4899'
                }
              },
              xaxis: {
                ...commonOptions.xaxis,
                categories: financialData.map((item: any) => item.year || ''),
                title: {
                  text: 'Năm',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                }
              },
              yaxis: {
                ...commonOptions.yaxis,
                title: {
                  text: 'Hệ số',
                  style: {
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }
                },
                labels: {
                  ...commonOptions.yaxis.labels,
                  formatter: function(val: number) {
                    return val.toFixed(1);
                  }
                }
              },
              colors: ['#ec4899', '#8b5cf6'],
              tooltip: {
                ...commonOptions.tooltip,
                y: {
                  formatter: function(val: number) {
                    return val.toFixed(2);
                  }
                }
              }
            }}
            series={[
              {
                name: 'Nợ / Vốn chủ sở hữu',
                data: financialData.map((item: any) => item.debt || 0)
              },
              {
                name: 'Tổng tài sản / Vốn chủ sở hữu',
                data: financialData.map((item: any) => item.assets || 0)
              }
            ]}
            type="bar"
            height={350}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full p-5 rounded-xl shadow-xl bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-slate-100">
          <span className="text-blue-400 mr-2">#{symbol}</span>
          Phân tích chỉ số tài chính
        </h2>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setActiveView('quarter')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-200 ${
              activeView === 'quarter'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            Theo quý
          </button>
          <button
            type="button"
            onClick={() => setActiveView('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-200 ${
              activeView === 'year'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            Theo năm
          </button>
        </div>
      </div>

      {activeView === 'quarter' ? renderQuarterlyCharts() : renderYearlyCharts()}
      
      <div className="mt-6 text-center text-slate-400 text-xs">
        <p>Dữ liệu được cập nhật từ báo cáo tài chính của công ty</p>
      </div>
    </div>
  );
}