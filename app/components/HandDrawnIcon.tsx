type HandDrawnIconProps = {
  name: string;
  alt?: string;
  size?: number;
  className?: string;
};

export default function HandDrawnIcon({ name, alt, size = 24, className = "" }: HandDrawnIconProps) {
  return (
    <span
      className={`hand-drawn-icon shrink-0 ${className}`.trim()}
      style={{ width: size, height: size, WebkitMaskImage: `url(/hand-drawn-icons/${name}.svg)`, maskImage: `url(/hand-drawn-icons/${name}.svg)` }}
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt}
    />
  );
}