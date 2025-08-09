import { Search, Bell, User } from 'lucide-react';
import DrawingCanvas from '@/components/laser-pointer/DrawingCanvas';
import FloatingToolbar from '@/components/laser-pointer/FloatingToolbar';
import StatusIndicator from '@/components/laser-pointer/StatusIndicator';
import { useDrawing } from '@/hooks/useDrawing';

import { useQuery } from "@tanstack/react-query";
import { getData } from "../api";

export default function Home() {
  const drawingHook = useDrawing();

  // Fetch backend data
  const { data, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: getData,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 relative">
      <div className="min-h-screen relative">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-ios shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Demo Web Content</h1>
              <div className="flex space-x-4">
                <button className="text-[color:var(--ios-blue)] hover:opacity-80 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="text-[color:var(--ios-blue)] hover:opacity-80 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="text-[color:var(--ios-blue)] hover:opacity-80 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Show API Data */}
        <main className="p-6 space-y-8">
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Backend Data</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {data && (
              <pre className="bg-gray-100 p-4 rounded-lg">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </section>

          {/* Your existing demo content here... */}
        </main>
      </div>

      <DrawingCanvas drawingHook={drawingHook} />
      <FloatingToolbar drawingHook={drawingHook} />
      <StatusIndicator isLaserMode={drawingHook.state.isLaserMode} />
    </div>
  );
}
