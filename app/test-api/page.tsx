"use client";

import { useEffect, useState } from "react";
import { fetchSelectedStocksWithPriceHistory } from "@/services/stockService";

export default function TestApiPage() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const result = await fetchSelectedStocksWithPriceHistory();
        setResponse(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Response Test</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Response Structure:</h2>
        <pre className="bg-gray-800 p-4 rounded mt-2 overflow-auto max-h-[500px] text-white">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Type Information:</h2>
        <pre className="bg-gray-800 p-4 rounded mt-2 overflow-auto text-white">
          {`Type: ${Array.isArray(response) ? "Array" : typeof response}
${Array.isArray(response) ? `Array length: ${response.length}` : ""}
${response && !Array.isArray(response) ? `Has 'stocks' property: ${Boolean(response.stocks)}` : ""}
${response && !Array.isArray(response) && response.stocks ? `'stocks' is array: ${Array.isArray(response.stocks)}` : ""}
${response && !Array.isArray(response) && Array.isArray(response.stocks) ? `'stocks' length: ${response.stocks.length}` : ""}`}
        </pre>
      </div>
    </div>
  );
} 