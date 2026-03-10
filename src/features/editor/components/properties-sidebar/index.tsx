import { Activity, memo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { useEditorStore } from '@/shared/state/editor';
import { useSelectionStore } from '@/shared/state/selection';
import { CanvasPanel } from './canvas-panel';
import { ClipPanel } from './clip-panel';
import { MarkerPanel } from './marker-panel';
import { TransitionPanel } from './transition-panel';

/**
 * Properties sidebar - right panel for editing properties.
 * Shows TransitionPanel when a transition is selected, MarkerPanel when a marker
 * is selected, ClipPanel when clips are selected, CanvasPanel otherwise.
 */
export const PropertiesSidebar = memo(function PropertiesSidebar() {
  // Use granular selectors - Zustand v5 best practice
  const rightSidebarOpen = useEditorStore((s) => s.rightSidebarOpen);
  const toggleRightSidebar = useEditorStore((s) => s.toggleRightSidebar);
  const rightSidebarWidth = useEditorStore((s) => s.rightSidebarWidth);
  const setRightSidebarWidth = useEditorStore((s) => s.setRightSidebarWidth);
  const selectedItemIds = useSelectionStore((s) => s.selectedItemIds);
  const selectedMarkerId = useSelectionStore((s) => s.selectedMarkerId);
  const selectedTransitionId = useSelectionStore((s) => s.selectedTransitionId);

  const hasClipSelection = selectedItemIds.length > 0;

  // Resize handle logic
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = rightSidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [rightSidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      // Dragging left increases width for right sidebar
      const delta = startXRef.current - e.clientX;
      const newWidth = Math.min(500, Math.max(320, startWidthRef.current + delta));
      setRightSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [setRightSidebarWidth]);

  return (""
  );
});
