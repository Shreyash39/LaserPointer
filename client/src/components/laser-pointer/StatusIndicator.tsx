interface StatusIndicatorProps {
  isLaserMode: boolean;
}

export default function StatusIndicator({ isLaserMode }: StatusIndicatorProps) {
  return (
    <div className={`fixed top-6 right-6 z-40 floating-panel px-4 py-2 transform transition-smooth ${
      isLaserMode 
        ? 'translate-y-0 opacity-100 visible' 
        : 'translate-y-2 opacity-0 invisible'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-[color:var(--ios-red)] rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-900">Laser Mode Active</span>
      </div>
    </div>
  );
}
