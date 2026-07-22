// Same entrance effect as the homepage hero (animate-fadeUp, staggered via
// animationDelay) packaged for reuse on every other page.
export default function FadeIn({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}) {
  return (
    <Tag
      className={`animate-fadeUp ${className}`}
      style={{ animationDelay: `${delay}s`, ...style }}
    >
      {children}
    </Tag>
  );
}
