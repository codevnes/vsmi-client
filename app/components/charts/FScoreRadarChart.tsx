'use client';

import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface FScoreRadarProps {
  indicators: {
    roaPositive: boolean;
    cfoPositive: boolean;
    roaGrowth: boolean;
    cfoGreaterThanLNST: boolean;
    longTermDebtDecreased: boolean;
    currentRatioIncreased: boolean;
    noShareIssuance: boolean;
    grossMarginIncreased: boolean;
    assetTurnoverIncreased: boolean;
  };
}

export default function FScoreRadarChart({ indicators }: FScoreRadarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side or initial render
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded-full opacity-50"></div>
      </div>
    );
  }
  
  const isDark = theme === 'dark';

  const data = {
    labels: [
      'ROA>0 (%)',
      'CFO>0 (tỷ)',
      'ΔROA>0 (%)',
      'CFO>LNST (tỷ)',
      'ΔNợ dài hạn<0\n(tỷ)',
      'ΔCurrent\nRatio>0 (%)',
      'Không phát hành\nCP',
      'ΔGross\nMargin>0',
      'ΔAsset\nTurnover>0',
    ],
    datasets: [
      {
        label: 'F-Score',
        data: [
          indicators.roaPositive ? 1 : 0,
          indicators.cfoPositive ? 1 : 0,
          indicators.roaGrowth ? 1 : 0,
          indicators.cfoGreaterThanLNST ? 1 : 0,
          indicators.longTermDebtDecreased ? 1 : 0,
          indicators.currentRatioIncreased ? 1 : 0,
          indicators.noShareIssuance ? 1 : 0,
          indicators.grossMarginIncreased ? 1 : 0,
          indicators.assetTurnoverIncreased ? 1 : 0,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#1e40af',
        borderWidth: 2,
        pointBackgroundColor: '#1e40af',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1e40af',
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          display: false,
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
          circular: true,
        },
        pointLabels: {
          color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            size: 10,
            weight: 'bold' as const
          },
          padding: 10,
        },
        angleLines: {
          color: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.raw === 1 ? 'Đạt' : 'Không đạt';
          }
        }
      }
    },
    maintainAspectRatio: true,
    responsive: true,
  };

  return (
    <div className="w-full h-full">
      <Radar data={data} options={options} />
    </div>
  );
} 