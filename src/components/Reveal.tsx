import { useReveal } from "../hooks/useScroll";

/** Wraps children in a scroll-reveal container. */
export function Reveal({
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
