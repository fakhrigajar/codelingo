import { motion } from "framer-motion";

// Fades content up into place as it scrolls into view (once per element,
// via viewport: { once: true }) instead of animating on mount.
export default function FadeIn({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
