import { useState, useRef, useEffect } from 'react';
import { X, Edit3, Circle, Minus, ArrowRight, Eraser, Undo, Settings, Zap, ArrowLeft } from 'lucide-react';
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
  { id: 'laser' as 'laser', icon: Zap, label: 'Laser Pointer' },
  { id: 'pen' as 'pen', icon: Edit3, label: 'Drawing Pen' },
];

const drawingTools = [
  { id: 'freehand' as DrawingTool, icon: Edit3, label: 'Freehand' },
  { id: 'circle' as DrawingTool, icon: Circle, label: 'Circle' },
  { id: 'underline' as DrawingTool, icon: Minus, label: 'Underline' },
  { id: 'arrow' as DrawingTool, icon: ArrowRight, label: 'Arrow' },
  { id: 'eraser' as DrawingTool, icon: Eraser, label: 'Eraser' },
];

export default function FloatingToolbar({ drawingHook }: FloatingToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState<'laser' | 'pen'>('laser');
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 });
  
  const {
    state,
    setLaserMode,
    setTool,
    setColor,
    setThickness,
    setPointerMode,
    clearCanvas,
    undoLastDrawing,
    toggleMenu,
    hideMenu,
    updateMenuPosition,
  } = drawingHook;

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const goBackToMenu = () => {
    setShowSettings(false);
  };

  const handleModeSwitch = (mode: 'laser' | 'pen') => {
    setCurrentMode(mode);
    setPointerMode(mode);
    setLaserMode(true); // Always keep laser mode active for drawing
    setTool('freehand'); // Default to freehand drawing
    hideMenu(); // Auto-hide menu when tool is selected
  };

  const handleToolSelect = (tool: DrawingTool) => {
    setTool(tool);
    hideMenu(); // Auto-hide menu when tool is selected
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX - state.menuPosition.x,
      startY: clientY - state.menuPosition.y,
    };
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragRef.current.startX;
    const newY = clientY - dragRef.current.startY;
    
    // Keep within screen bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    updateMenuPosition({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  const handleColorSelect = (color: string) => {
    setColor(color);
  };

  const handleThicknessChange = (thickness: number) => {
    setThickness(thickness);
  };

  return (
    <>
      {/* Main Floating Action Button - Draggable */}
      <div 
        className="fixed z-50 cursor-move select-none"
        style={{ 
          left: `${state.menuPosition.x}px`, 
          top: `${state.menuPosition.y}px` 
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <button
          onClick={toggleMenu}
          className="w-14 h-14 bg-[color:var(--ios-blue)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 touch-feedback flex items-center justify-center"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {/* Simple Mode Selection Panel */}
      <div className={`fixed z-50 transform transition-smooth ${
        state.isMenuVisible && !showSettings
          ? 'translate-y-0 opacity-100 visible' 
          : 'translate-y-4 opacity-0 invisible'
      }`}
      style={{ 
        left: `${state.menuPosition.x}px`, 
        top: `${state.menuPosition.y + 80}px` 
      }}>
        <div className="floating-panel p-4 w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Laser Tools</h3>
            <button
              onClick={hideMenu}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Mode Buttons */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => handleModeSwitch('laser')}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                currentMode === 'laser'
                  ? 'bg-[color:var(--ios-blue)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-5 h-5 mr-3" />
              Laser Pointer
            </button>
            <button
              onClick={() => handleModeSwitch('pen')}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center ${
                currentMode === 'pen'
                  ? 'bg-[color:var(--ios-blue)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="w-5 h-5 mr-3" />
              Drawing Pen
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={toggleSettings}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Detailed Settings Panel */}
      <div className={`fixed z-50 transform transition-smooth ${
        showSettings 
          ? 'translate-y-0 opacity-100 visible' 
          : 'translate-y-4 opacity-0 invisible'
      }`}
      style={{ 
        left: `${state.menuPosition.x}px`, 
        top: `${state.menuPosition.y + 80}px` 
      }}>
        <div className="floating-panel p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={goBackToMenu}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors mr-2"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
              <h3 className="font-semibold text-gray-900">Settings</h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Current Mode Display */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Mode</h4>
            <div className="bg-[color:var(--ios-light)] rounded-xl p-3">
              <div className="flex items-center">
                {currentMode === 'laser' ? (
                  <>
                    <Zap className="w-5 h-5 mr-3 text-[color:var(--ios-blue)]" />
                    <span className="font-medium">Laser Pointer</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-5 h-5 mr-3 text-[color:var(--ios-blue)]" />
                    <span className="font-medium">Drawing Pen</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Drawing Tools (only for pen mode) */}
          {currentMode === 'pen' && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Drawing Tools</h4>
              <div className="grid grid-cols-4 gap-2">
                {drawingTools.map((tool) => (
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
          )}

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
