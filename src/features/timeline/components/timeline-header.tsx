import { useRef, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Film,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Magnet,
  Scissors,
  Gauge,
  SplitSquareHorizontal,
  MoveHorizontal,
  ArrowRightLeft,
  BetweenHorizontalEnd,
  X,
  MousePointer2,
  Undo2,
  Redo2,
  Flag,
  FlagOff,
  LineChart,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTimelineZoom } from '../hooks/use-timeline-zoom';
import { useTimelineStore } from '../stores/timeline-store';
import { useTimelineCommandStore } from '../stores/timeline-command-store';
import { usePlaybackStore } from '@/shared/state/playback';
import { useSelectionStore } from '@/shared/state/selection';
import {
  ZOOM_FRICTION,
  ZOOM_MIN_VELOCITY,
  ZOOM_MIN,
  ZOOM_MAX,
} from '../constants';

interface TimelineHeaderProps {
  onZoomChange?: (newZoom: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomToFit?: () => void;
  /** Whether the keyframe graph panel is open */
  isGraphPanelOpen?: boolean;
  /** Callback to toggle the graph panel */
  onToggleGraphPanel?: () => void;
}

/**
 * Timeline Toolbar Component
 *
 * Unified toolbar for timeline controls:
 * - Select/Razor tools
 * - Undo/Redo
 * - In/Out points, Snap toggle
 * - Zoom controls
 */
export const TimelineHeader = memo(function TimelineHeader({
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  isGraphPanelOpen,
  onToggleGraphPanel,
}: TimelineHeaderProps) {
  const { zoomLevel, zoomIn, zoomOut, setZoom } = useTimelineZoom();
  const snapEnabled = useTimelineStore((s) => s.snapEnabled);
  const toggleSnap = useTimelineStore((s) => s.toggleSnap);
  const inPoint = useTimelineStore((s) => s.inPoint);
  const outPoint = useTimelineStore((s) => s.outPoint);
  const setInPoint = useTimelineStore((s) => s.setInPoint);
  const setOutPoint = useTimelineStore((s) => s.setOutPoint);
  const clearInOutPoints = useTimelineStore((s) => s.clearInOutPoints);
  const addMarker = useTimelineStore((s) => s.addMarker);
  // Only subscribe to marker count for disabled state - avoids re-render on marker changes
  const hasMarkers = useTimelineStore((s) => s.markers.length > 0);
  const removeMarker = useTimelineStore((s) => s.removeMarker);
  const clearAllMarkers = useTimelineStore((s) => s.clearAllMarkers);
  // NOTE: Don't subscribe to currentFrame - only needed in click handlers
  // Read from store directly when needed to avoid re-renders every frame
  const activeTool = useSelectionStore((s) => s.activeTool);
  const setActiveTool = useSelectionStore((s) => s.setActiveTool);
  const selectedMarkerId = useSelectionStore((s) => s.selectedMarkerId);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const canUndo = useTimelineCommandStore((s) => s.canUndo);
  const canRedo = useTimelineCommandStore((s) => s.canRedo);
  const undoLabel = useTimelineCommandStore((s) => s.getUndoLabel());
  const redoLabel = useTimelineCommandStore((s) => s.getRedoLabel());


  // Momentum state for zoom slider
  const zoomVelocityRef = useRef(0);
  const lastZoomValueRef = useRef(zoomLevel);
  const lastZoomTimeRef = useRef(0);
  const momentumIdRef = useRef<number | null>(null);
  const sliderRafIdRef = useRef<number | null>(null);
  const queuedSliderZoomRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const zoomLevelRef = useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;

  // Apply zoom with bounds checking
  const applyZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
    if (onZoomChange) {
      onZoomChange(clampedZoom);
    } else {
      setZoom(clampedZoom);
    }
    return clampedZoom;
  }, [onZoomChange, setZoom]);

  // Momentum loop for zoom slider
  const startZoomMomentum = useCallback(() => {
    if (momentumIdRef.current !== null) {
      cancelAnimationFrame(momentumIdRef.current);
    }

    const momentumLoop = () => {
      if (Math.abs(zoomVelocityRef.current) > ZOOM_MIN_VELOCITY) {
        const newZoom = zoomLevelRef.current + zoomVelocityRef.current;
        const clampedZoom = applyZoom(newZoom);

        // Stop momentum if we hit bounds
        if (clampedZoom <= ZOOM_MIN || clampedZoom >= ZOOM_MAX) {
          zoomVelocityRef.current = 0;
          momentumIdRef.current = null;
          return;
        }

        zoomVelocityRef.current *= ZOOM_FRICTION;
        momentumIdRef.current = requestAnimationFrame(momentumLoop);
      } else {
        zoomVelocityRef.current = 0;
        momentumIdRef.current = null;
      }
    };

    momentumIdRef.current = requestAnimationFrame(momentumLoop);
  }, [applyZoom]);

  // Convert between linear slider position (0-1) and logarithmic zoom level
  // This gives finer control at low zoom levels
  const sliderToZoom = useCallback((sliderValue: number) => {
    // Map 0-1 to log scale: ZOOM_MIN to ZOOM_MAX
    // Using exponential: zoom = min * (max/min)^slider
    return ZOOM_MIN * Math.pow(ZOOM_MAX / ZOOM_MIN, sliderValue);
  }, []);

  const zoomToSlider = useCallback((zoom: number) => {
    // Inverse of sliderToZoom: slider = log(zoom/min) / log(max/min)
    return Math.log(zoom / ZOOM_MIN) / Math.log(ZOOM_MAX / ZOOM_MIN);
  }, []);

  // Handle slider value change (while dragging)
  const handleSliderChange = useCallback((values: number[]) => {
    const sliderValue = values[0] ?? 0.5;
    const newZoom = sliderToZoom(sliderValue);
    const now = performance.now();
    const timeDelta = now - lastZoomTimeRef.current;

    // Calculate velocity based on change over time (in zoom space, not slider space)
    if (timeDelta > 0 && timeDelta < 100) {
      const valueDelta = newZoom - lastZoomValueRef.current;
      zoomVelocityRef.current = valueDelta / timeDelta * 16; // Normalize to ~60fps
    }

    lastZoomValueRef.current = newZoom;
    lastZoomTimeRef.current = now;
    isDraggingRef.current = true;
    queuedSliderZoomRef.current = newZoom;
    if (sliderRafIdRef.current === null) {
      sliderRafIdRef.current = requestAnimationFrame(() => {
        sliderRafIdRef.current = null;
        const queuedZoom = queuedSliderZoomRef.current;
        if (queuedZoom !== null) {
          applyZoom(queuedZoom);
        }
      });
    }
  }, [applyZoom, sliderToZoom]);

  // Handle slider release - start momentum
  const handleSliderCommit = useCallback(() => {
    isDraggingRef.current = false;
    if (sliderRafIdRef.current !== null) {
      cancelAnimationFrame(sliderRafIdRef.current);
      sliderRafIdRef.current = null;
    }
    if (queuedSliderZoomRef.current !== null) {
      applyZoom(queuedSliderZoomRef.current);
      queuedSliderZoomRef.current = null;
    }
    // Only start momentum if there's meaningful velocity
    if (Math.abs(zoomVelocityRef.current) > ZOOM_MIN_VELOCITY) {
      startZoomMomentum();
    }
    // Blur slider to release focus for keyboard shortcuts (play/pause)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [applyZoom, startZoomMomentum]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (momentumIdRef.current !== null) {
        cancelAnimationFrame(momentumIdRef.current);
      }
      if (sliderRafIdRef.current !== null) {
        cancelAnimationFrame(sliderRafIdRef.current);
      }
    };
  }, []);

  const handleUndo = () => {
    useTimelineStore.temporal.getState().undo();
  };

  const handleRedo = () => {
    useTimelineStore.temporal.getState().redo();
  };

  return (
    ""
   
  );
});
