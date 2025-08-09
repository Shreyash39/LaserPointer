import { useState } from 'react';
import { X, Edit3, Circle, Minus, ArrowRight, Eraser, Undo } from 'lucide-react';
import { useDrawing, DrawingTool } from '@/hooks/useDrawing';

interface FloatingToolbarProps {
  drawingHook: ReturnType<typeof useDrawing>;
}

const colors = [
  { name: 'Red', value: '#FF3B30', css: 'bg-[#FF3B30]' },
  { name: 'Blue', value: '#007AFF', css: 'bg-[#007AFF]' },
  { name: 'Green', value: '#34C759', css: 'bg-[#34C759]' },
  { name: 'Orange', value: '#FF9500', css: 'bg-[#FF9500]' },
  { name: 'Black', value: '#1C1C1E', css: 'bg-[#1C1C1E]' },
];

const tools = [
  { id: 'freehand' as DrawingTool, icon: Edit3, label: 'Freehand' },
  { id: 'circle' as DrawingTool, icon: Circle, label: 'Circle' },
  { id: 'underline' as DrawingTool, icon: Minus, label: 'Underline' },
  { id: 'arrow' as DrawingTool, icon: ArrowRight, label: 'Arrow' },
];

export default function FloatingToolbar({ drawingHook }: FloatingToolbarProps) {
  const [showPanel, setShowPanel] = useState(false);
  const {
    state,
    setLaserMode,
    setTool,
    setColor,
    setThickness,
    clearCanvas,
    undoLastDrawing,
  } = drawingHook;

  const togglePanel = () => {
    if (showPanel) {
      setShowPanel(false);
    } else {
      setShowPanel(true);
    }
  };

  const handleModeSwitch = (isLaser: boolean) => {
    setLaserMode(isLaser);
  };

  const handleToolSelect = (tool: DrawingTool) => {
    setTool(tool);
  };

  const handleColorSelect = (color: string) => {
    setColor(color);
  };

  const handleThicknessChange = (thickness: number) => {
    setThickness(thickness);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={togglePanel}
          className="w-14 h-14 bg-[color:var(--ios-blue)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 touch-feedback flex items-center justify-center"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Toolbar Panel */}
      <div className={`fixed bottom-24 right-6 z-50 transform transition-smooth ${
        showPanel 
          ? 'translate-y-0 opacity-100 visible' 
          : 'translate-y-4 opacity-0 invisible'
      }`}>
        <div className="floating-panel p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Laser Pointer Tools</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="mb-6">
            <div className="flex bg-[color:var(--ios-light)] rounded-xl p-1">
              <button
                onClick={() => handleModeSwitch(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center ${
                  state.isLaserMode
                    ? 'bg-white shadow-sm text-[color:var(--ios-blue)]'
                    : 'text-gray-600'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Laser
              </button>
              <button
                onClick={() => handleModeSwitch(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center ${
                  !state.isLaserMode
                    ? 'bg-white shadow-sm text-[color:var(--ios-blue)]'
                    : 'text-gray-600'
                }`}
              >
                <span className="w-4 h-4 mr-2">👆</span>
                Touch
              </button>
            </div>
          </div>

          {/* Drawing Tools */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Drawing Tools</h4>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`tool-button ${
                    state.currentTool === tool.id ? 'active' : ''
                  }`}
                >
                  <tool.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Laser Color</h4>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`color-button ${color.css} ${
                    state.currentColor === color.value
                      ? 'active border-gray-400'
                      : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Thickness Control */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Line Thickness</h4>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">Thin</span>
              <input
                type="range"
                min="2"
                max="12"
                value={state.currentThickness}
                onChange={(e) => handleThicknessChange(Number(e.target.value))}
                className="flex-1 accent-[color:var(--ios-blue)]"
              />
              <span className="text-xs text-gray-500">Thick</span>
            </div>
            <div
              className="mt-2 rounded-full transition-all duration-200"
              style={{
                height: `${state.currentThickness}px`,
                backgroundColor: state.currentColor,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={clearCanvas}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear All
            </button>
            <button
              onClick={undoLastDrawing}
              className="flex-1 py-3 px-4 bg-[color:var(--ios-blue)] text-white rounded-xl font-medium hover:opacity-80 transition-all flex items-center justify-center"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
