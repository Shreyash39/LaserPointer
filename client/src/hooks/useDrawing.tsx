import { useState, useRef, useCallback } from 'react';

export type DrawingTool = 'freehand' | 'circle' | 'underline' | 'arrow';

export interface DrawingState {
  isDrawing: boolean;
  isLaserMode: boolean;
  currentTool: DrawingTool;
  currentColor: string;
  currentThickness: number;
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
  });
  
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const currentDrawing = useRef<Drawing | null>(null);

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

  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    drawings.forEach((drawing) => {
      context.strokeStyle = drawing.color;
      context.lineWidth = drawing.thickness;
      
      if (drawing.points.length > 1) {
        context.beginPath();
        context.moveTo(drawing.points[0].x, drawing.points[0].y);
        
        for (let i = 1; i < drawing.points.length; i++) {
          context.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        
        context.stroke();
      }
    });
  }, [drawings]);

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
  }, [state.isDrawing, state.isLaserMode, getEventPoint]);

  const stopDrawing = useCallback(() => {
    if (!state.isDrawing || !currentDrawing.current) return;
    
    setDrawings(prev => [...prev, currentDrawing.current!]);
    currentDrawing.current = null;
    setState(prev => ({ ...prev, isDrawing: false }));
  }, [state.isDrawing]);

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

  const clearCanvas = useCallback(() => {
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
    setDrawings([]);
  }, []);

  const undoLastDrawing = useCallback(() => {
    setDrawings(prev => prev.slice(0, -1));
    setTimeout(() => redrawCanvas(), 0);
  }, [redrawCanvas]);

  return {
    canvasRef,
    state,
    drawings,
    initializeCanvas,
    startDrawing,
    draw,
    stopDrawing,
    setLaserMode,
    setTool,
    setColor,
    setThickness,
    clearCanvas,
    undoLastDrawing,
  };
}
