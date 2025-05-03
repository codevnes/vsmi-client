'use client';

export function MarketSummaryCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">VN-Index</p>
            <h3 className="text-2xl font-bold mt-1">1,234.56</h3>
          </div>
          <div className="text-emerald-500 flex items-center text-sm">
            +12.34 (+1.01%)
          </div>
        </div>
        <div className="mt-4 h-10 bg-emerald-500/10 rounded-md"></div>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">HNX-Index</p>
            <h3 className="text-2xl font-bold mt-1">234.56</h3>
          </div>
          <div className="text-rose-500 flex items-center text-sm">
            -2.34 (-0.99%)
          </div>
        </div>
        <div className="mt-4 h-10 bg-rose-500/10 rounded-md"></div>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">UPCOM-Index</p>
            <h3 className="text-2xl font-bold mt-1">89.12</h3>
          </div>
          <div className="text-emerald-500 flex items-center text-sm">
            +0.56 (+0.63%)
          </div>
        </div>
        <div className="mt-4 h-10 bg-emerald-500/10 rounded-md"></div>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Khối lượng giao dịch</p>
            <h3 className="text-2xl font-bold mt-1">432.1M</h3>
          </div>
          <div className="text-muted-foreground text-sm">
            +7.8% so với TB
          </div>
        </div>
        <div className="mt-4 h-10 bg-primary/10 rounded-md"></div>
      </div>
    </section>
  );
} 