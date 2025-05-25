
      {/* Section 4: Thị trường tiền tệ và Tin tức tiền tệ */}
      <section className="py-6">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-blue-900/10 to-emerald-900/10 px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">Thị Trường Tiền Tệ</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tỷ giá hối đoái quốc tế và tin tức thị trường tiền tệ mới nhất
            </p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-7">
                <CurrencyChart />
              </div>
              <div className="col-span-12 md:col-span-5 md:border-l md:pl-6">
                <CurrencyNews />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>