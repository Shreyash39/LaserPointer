import { Search, Bell, User } from 'lucide-react';
import DrawingCanvas from '@/components/laser-pointer/DrawingCanvas';
import FloatingToolbar from '@/components/laser-pointer/FloatingToolbar';
import StatusIndicator from '@/components/laser-pointer/StatusIndicator';
import { useDrawing } from '@/hooks/useDrawing';

export default function Home() {
  const drawingHook = useDrawing();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 relative">
      {/* Demo Background Content */}
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

        {/* Main Content Area */}
        <main className="p-6 space-y-8">
          {/* Hero Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Content for Annotation</h2>
            <p className="text-lg text-gray-600 mb-6">
              This is a demo page showing how the laser pointer extension would work on any web content. 
              You can circle important elements, underline text, or draw arrows to highlight specific areas.
            </p>
            
            {/* Interactive Elements */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[color:var(--ios-light)] rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Important Button</h3>
                <button className="ios-button-primary">
                  Click Here
                </button>
              </div>
              
              <div className="bg-[color:var(--ios-light)] rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Key Information</h3>
                <p className="text-gray-600">
                  This text might need to be underlined or highlighted during a presentation.
                </p>
              </div>
              
              <div className="bg-[color:var(--ios-light)] rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Navigation Icon</h3>
                <div className="text-2xl text-[color:var(--ios-blue)]">→</div>
              </div>
            </div>
          </section>

          {/* Additional Content */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More Content to Annotate</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>First important point that might need highlighting</li>
                <li>Second key item for annotation</li>
                <li>Third critical element for emphasis</li>
              </ul>
            </div>
          </section>

          {/* Additional demo content sections */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Form Elements</h3>
                <input 
                  type="text" 
                  placeholder="Sample input field" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--ios-blue)] focus:border-transparent"
                />
                <button className="ios-button-secondary">
                  Sample Button
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Content Areas</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This content area can be circled or annotated with the laser pointer tool.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-[color:var(--ios-blue)] text-white text-sm rounded-full">Tag 1</span>
                  <span className="px-3 py-1 bg-[color:var(--ios-green)] text-white text-sm rounded-full">Tag 2</span>
                  <span className="px-3 py-1 bg-[color:var(--ios-orange)] text-white text-sm rounded-full">Tag 3</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Drawing Canvas Overlay */}
      <DrawingCanvas drawingHook={drawingHook} />

      {/* Floating Toolbar */}
      <FloatingToolbar drawingHook={drawingHook} />

      {/* Status Indicator */}
      <StatusIndicator isLaserMode={drawingHook.state.isLaserMode} />
    </div>
  );
}
