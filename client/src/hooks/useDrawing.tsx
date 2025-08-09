import { useState, useRef, useCallback, useEffect } from 'react';

export type DrawingTool = 'freehand' | 'circle' | 'underline' | 'arrow' | 'eraser';
export type PointerMode = 'laser' | 'pen';

export interface DrawingState {
  isDrawing: boolean;
  isLaserMode: boolean;
  currentTool: DrawingTool;
  currentColor: string;
  currentThickness: number;
  pointerMode: PointerMode;
  isMenuVisible: boolean;
  menuPosition: { x: number; y: number };
}

export interface Point {
  x: number;
  y: number;
}

export interface Drawing {
  id: string;
  tool: DrawingTool;
  color: string;
  thickness: number;
  points: Point[];
}

export function useDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [state, setState] = useState<DrawingState>({
    isDrawing: false,
    isLaserMode: false,
    currentTool: 'freehand',
    currentColor: '#FF3B30',
    currentThickness: 4,
    pointerMode: 'laser',
    isMenuVisible: false,
    menuPosition: { x: 20, y: 20 },
  });
  
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [temporaryDrawings, setTemporaryDrawings] = useState<Drawing[]>([]);
  const currentDrawing = useRef<Drawing | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLaserTimeRef = useRef<number>(0);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
        redrawCanvas();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const drawLaserStroke = useCallback((context: CanvasRenderingContext2D, drawing: Drawing) => {
    if (!drawing || !drawing.points || drawing.points.length < 2) return;
    
    // Create glowing laser effect with multiple layers
    const glowSize = drawing.thickness + 4;
    
    // Outer glow (lighter, wider)
    context.shadowColor = drawing.color;
    context.shadowBlur = glowSize * 2;
    context.strokeStyle = drawing.color;
    context.lineWidth = drawing.thickness + 2;
    context.globalAlpha = 0.3;
    
    context.beginPath();
    context.moveTo(drawing.points[0].x, drawing.points[0].y);
    for (let i = 1; i < drawing.points.length; i++) {
      context.lineTo(drawing.points[i].x, drawing.points[i].y);
    }
    context.stroke();
    
    // Inner glow (medium intensity)
    context.shadowBlur = glowSize;
    context.lineWidth = drawing.thickness + 1;
    context.globalAlpha = 0.6;
    
    context.beginPath();
    context.moveTo(drawing.points[0].x, drawing.points[0].y);
    for (let i = 1; i < drawing.points.length; i++) {
      context.lineTo(drawing.points[i].x, drawing.points[i].y);
    }
    context.stroke();
    
    // Core stroke (solid, darker center)
    context.shadowBlur = 0;
    context.lineWidth = drawing.thickness;
    context.globalAlpha = 1;
    
    context.beginPath();
    context.moveTo(drawing.points[0].x, drawing.points[0].y);
    for (let i = 1; i < drawing.points.length; i++) {
      context.lineTo(drawing.points[i].x, drawing.points[i].y);
    }
    context.stroke();
    
    // Reset shadow
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
  }, []);

  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw permanent drawings (pen mode)
    drawings.forEach((drawing) => {
      if (!drawing || !drawing.points || !drawing.color) return;
      
      context.strokeStyle = drawing.color;
      context.lineWidth = drawing.thickness || 4;
      context.globalAlpha = 1;
      
      if (drawing.points.length > 1) {
        context.beginPath();
        context.moveTo(drawing.points[0].x, drawing.points[0].y);
        
        for (let i = 1; i < drawing.points.length; i++) {
          context.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        
        context.stroke();
      }
    });

    // Draw temporary drawings (laser mode) with glow effect
    temporaryDrawings.forEach((drawing) => {
      if (drawing) {
        drawLaserStroke(context, drawing);
      }
    });
    
    // Reset context state
    context.globalAlpha = 1;
  }, [drawings, temporaryDrawings, drawLaserStroke]);

  // Effect to redraw canvas when temporary drawings change
  useEffect(() => {
    redrawCanvas();
  }, [temporaryDrawings, redrawCanvas]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const getEventPoint = useCallback((e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    if (!state.isLaserMode || !contextRef.current) return;
    
    e.preventDefault();
    const point = getEventPoint(e);
    
    const newDrawing: Drawing = {
      id: Date.now().toString(),
      tool: state.currentTool,
      color: state.currentColor,
      thickness: state.currentThickness,
      points: [point],
    };
    
    currentDrawing.current = newDrawing;
    
    setState(prev => ({ ...prev, isDrawing: true }));
    
    const context = contextRef.current;
    
    // Apply glow effect for laser mode
    if (state.pointerMode === 'laser') {
      context.shadowColor = state.currentColor;
      context.shadowBlur = state.currentThickness + 4;
    } else {
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
    }
    
    context.strokeStyle = state.currentColor;
    context.lineWidth = state.currentThickness;
    context.beginPath();
    context.moveTo(point.x, point.y);
  }, [state, getEventPoint]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!state.isDrawing || !state.isLaserMode || !contextRef.current || !currentDrawing.current) return;
    
    e.preventDefault();
    const point = getEventPoint(e);
    
    currentDrawing.current.points.push(point);
    
    const context = contextRef.current;
    context.lineTo(point.x, point.y);
    context.stroke();
    
    // Clear and reset fade timer while drawing
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
  }, [state.isDrawing, state.isLaserMode, getEventPoint]);

  const stopDrawing = useCallback(() => {
    if (!state.isDrawing || !currentDrawing.current) return;
    
    const drawing = currentDrawing.current;
    
    // Only add drawing if it has valid data
    if (drawing && drawing.points && drawing.points.length > 0) {
      if (state.pointerMode === 'laser') {
        // For laser mode, add to temporary drawings and set fade timer
        setTemporaryDrawings(prev => [...prev, drawing]);
        
        // Update last laser time for continuous usage detection
        lastLaserTimeRef.current = Date.now();
        
        // Clear any existing timeout
        if (fadeTimeoutRef.current) {
          clearTimeout(fadeTimeoutRef.current);
        }
        
        // Set new timeout to fade laser pointer after 1 second
        fadeTimeoutRef.current = setTimeout(() => {
          // Only clear if no recent laser activity
          const timeSinceLastLaser = Date.now() - lastLaserTimeRef.current;
          if (timeSinceLastLaser >= 1000) {
            setTemporaryDrawings([]);
          }
        }, 1000);
      } else if (state.currentTool === 'eraser') {
        // For eraser mode, remove intersecting drawings
        eraseDrawings(drawing.points);
      } else {
        // For pen mode, add to permanent drawings
        setDrawings(prev => [...prev, drawing]);
      }
    }
    
    currentDrawing.current = null;
    setState(prev => ({ ...prev, isDrawing: false }));
  }, [state.isDrawing, state.pointerMode, state.currentTool]);

  const setLaserMode = useCallback((isLaser: boolean) => {
    setState(prev => ({ ...prev, isLaserMode: isLaser }));
  }, []);

  const setTool = useCallback((tool: DrawingTool) => {
    setState(prev => ({ ...prev, currentTool: tool }));
  }, []);

  const setColor = useCallback((color: string) => {
    setState(prev => ({ ...prev, currentColor: color }));
  }, []);

  const setThickness = useCallback((thickness: number) => {
    setState(prev => ({ ...prev, currentThickness: thickness }));
  }, []);

  const setPointerMode = useCallback((mode: PointerMode) => {
    setState(prev => ({ ...prev, pointerMode: mode }));
    
    // Clear temporary drawings when switching modes
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    setTemporaryDrawings([]);
  }, []);

  const eraseDrawings = useCallback((eraserPoints: Point[]) => {
    setDrawings(prev => {
      return prev.filter(drawing => {
        // Check if any eraser point intersects with drawing points
        return !eraserPoints.some(eraserPoint => {
          return drawing.points.some(drawingPoint => {
            const distance = Math.sqrt(
              Math.pow(eraserPoint.x - drawingPoint.x, 2) + 
              Math.pow(eraserPoint.y - drawingPoint.y, 2)
            );
            return distance < 20; // Eraser radius
          });
        });
      });
    });
  }, []);

  const clearCanvas = useCallback(() => {
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
    setDrawings([]);
    setTemporaryDrawings([]);
    
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMenuVisible: !prev.isMenuVisible }));
  }, []);

  const hideMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMenuVisible: false }));
  }, []);

  const updateMenuPosition = useCallback((position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, menuPosition: position }));
  }, []);

  const undoLastDrawing = useCallback(() => {
    setDrawings(prev => prev.slice(0, -1));
    setTimeout(() => redrawCanvas(), 0);
  }, [redrawCanvas]);

  return {
    canvasRef,
    state,
    drawings,
    temporaryDrawings,
    initializeCanvas,
    startDrawing,
    draw,
    stopDrawing,
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
  };
}
