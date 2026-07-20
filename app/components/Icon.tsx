import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaRocket,
  FaTelegram,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { FaArrowUpRightFromSquare, FaXTwitter } from "react-icons/fa6";
import { SiFiverr, SiUpwork } from "react-icons/si";

type IconProps = {
  name: string;
  alt?: string;
  size?: number;
  className?: string;
};

const ICONS: Record<string, IconType> = {
  "arrow-left": FaArrowLeft,
  "arrow-right": FaArrowRight,
  "arrow-up-right": FaArrowUpRightFromSquare,
  close: FaTimes,
  download: FaDownload,
  fiverr: SiFiverr,
  github: FaGithub,
  linkedin: FaLinkedin,
  location: FaMapMarkerAlt,
  mail: FaEnvelope,
  menu: FaBars,
  phone: FaPhone,
  rocket: FaRocket,
  telegram: FaTelegram,
  upwork: SiUpwork,
  visitor: FaEye,
  whatsapp: FaWhatsapp,
  x: FaXTwitter,
};

export default function Icon({ name, alt, size = 24, className = "" }: IconProps) {
  const IconComponent = ICONS[name] ?? FaArrowLeft;

  return (
    <IconComponent
      size={size}
      className={`shrink-0 ${className}`.trim()}
      aria-hidden={alt ? undefined : true}
      role={alt ? "img" : undefined}
      aria-label={alt}
    />
  );
}
