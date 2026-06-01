import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaTwitter,
  FaRegEnvelope,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaBriefcase,
} from "react-icons/fa";

type HandDrawnIconProps = {
  name: string;
  alt?: string;
  size?: number;
  className?: string;
};

const ICONS: Record<string, IconType> = {
  "arrow-left": FaArrowLeft,
  close: FaTimes,
  download: FaDownload,
  fiverr: FaBriefcase,
  github: FaGithub,
  linkedin: FaLinkedin,
  location: FaMapMarkerAlt,
  mail: FaRegEnvelope,
  menu: FaBars,
  phone: FaPhoneAlt,
  telegram: FaTelegramPlane,
  visitor: FaEye,
  x: FaTwitter,
};

export default function HandDrawnIcon({ name, alt, size = 24, className = "" }: HandDrawnIconProps) {
  const Icon = ICONS[name] ?? FaArrowLeft;

  return (
    <Icon
      size={size}
      className={`shrink-0 ${className}`.trim()}
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt}
    />
  );
}
