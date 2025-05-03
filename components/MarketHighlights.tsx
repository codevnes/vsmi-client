'use client';

import { useEffect, useState } from 'react';

export function MarketHighlights() {
  // Pre-calculate random values on the client side only
  const [topGainers, setTopGainers] = useState<{stock: string, change: string}[]>([]);
  const [topLosers, setTopLosers] = useState<{stock: string, change: string}[]>([]);
  
  useEffect(() => {
    // Generate stable random values client-side only
    const gainers = ["VNM", "FPT", "VIC", "VHM", "MSN"].map((stock) => ({
      stock,
      change: `+${(Math.random() * 6 + 1).toFixed(2)}%`
    }));
    
    const losers = ["GVR", "PLX", "POW", "HPG", "GAS"].map((stock) => ({
      stock,
      change: `-${(Math.random() * 6 + 1).toFixed(2)}%`
    }));
    
    setTopGainers(gainers);
    setTopLosers(losers);
  }, []);
  
  return (
    <section className="bg-card rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Điểm nhấn thị trường</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Tăng mạnh nhất</h3>
          <div className="space-y-2">
            {topGainers.map((item) => (
              <div key={item.stock} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50">
                <span className="font-medium">{item.stock}</span>
                <span className="text-emerald-500">{item.change}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Giảm mạnh nhất</h3>
          <div className="space-y-2">
            {topLosers.map((item) => (
              <div key={item.stock} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50">
                <span className="font-medium">{item.stock}</span>
                <span className="text-rose-500">{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 