import { useRef, useMemo, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { StageTransformContext } from "./context";

const PIXEL_PADDING = 150;

export const NewStage = ({
  onClick,
  children,
  onDrop,
  venueFixtures,
  resizable,
  width,
  height,
  defaultWidth = 600,
  defaultHeight = 400,
  onResize,
}: {
  children?: React.ReactNode;
  /** Pass venue fixtures to enable viewer mode (auto-crop to fit).
   *  Omit to use editor mode (fixtures placed at exact pixel coordinates). */
  venueFixtures?: { x: number; y: number }[];
  onDrop?: (
    e: React.DragEvent<HTMLDivElement>,
    coords: { x: number; y: number },
  ) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  resizable?: boolean;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  onResize?: (size: { width: number; height: number }) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;
  const onResizeTimer = useRef<ReturnType<typeof setTimeout>>();

  const viewerMode = venueFixtures !== undefined;

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (viewerMode) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
      if (onResizeRef.current) {
        clearTimeout(onResizeTimer.current);
        onResizeTimer.current = setTimeout(() => {
          onResizeRef.current!({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }, 200);
      }
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [viewerMode]);

  const bounds = useMemo(() => {
    if (!viewerMode) return null;
    if (!venueFixtures!.length) return { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };

    const xs = venueFixtures!.map((f) => f.x);
    const ys = venueFixtures!.map((f) => f.y);
    const tightMinX = Math.min(...xs);
    const tightMaxX = Math.max(...xs);
    const tightMinY = Math.min(...ys);
    const tightMaxY = Math.max(...ys);

    const scaleX = Math.max(tightMaxX - tightMinX, 1) / containerSize.width;
    const scaleY = Math.max(tightMaxY - tightMinY, 1) / containerSize.height;
    const scale = Math.max(scaleX, scaleY);
    const vPad = PIXEL_PADDING * scale;

    return {
      minX: tightMinX - vPad,
      maxX: tightMaxX + vPad,
      minY: tightMinY - vPad,
      maxY: tightMaxY + vPad,
    };
  }, [viewerMode, venueFixtures, containerSize]);

  const toDisplay = bounds
    ? (x: number, y: number) => {
        const w = bounds.maxX - bounds.minX;
        const h = bounds.maxY - bounds.minY;
        return {
          left: `${((x - bounds.minX) / w) * 100}%`,
          top: `${((y - bounds.minY) / h) * 100}%`,
        };
      }
    : (x: number, y: number) => ({ left: `${x}px`, top: `${y}px` });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDrop || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    if (bounds) {
      const w = bounds.maxX - bounds.minX;
      const h = bounds.maxY - bounds.minY;
      onDrop(e, {
        x: bounds.minX + ((e.clientX - rect.left) / rect.width) * w,
        y: bounds.minY + ((e.clientY - rect.top) / rect.height) * h,
      });
    } else {
      onDrop(e, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const resizableStyle = resizable
    ? {
        width: width ?? defaultWidth,
        height: height ?? defaultHeight,
        resize: "both" as const,
        overflow: "hidden" as const,
        minWidth: 200,
        minHeight: 150,
      }
    : {};

  return (
    <StageTransformContext.Provider value={{ toDisplay }}>
      <div
        data-testid="stage"
        onClick={onClick}
        ref={ref}
        className={styles.stage}
        style={resizableStyle}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {children}
      </div>
    </StageTransformContext.Provider>
  );
};
