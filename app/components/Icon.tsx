import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFacebook,
  FaGithub,
  FaLink,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaPowerOff,
  FaQuoteLeft,
  FaRocket,
  FaTelegram,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { FaArrowUpRightFromSquare, FaShareNodes, FaXTwitter } from "react-icons/fa6";
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
  facebook: FaFacebook,
  fiverr: SiFiverr,
  github: FaGithub,
  link: FaLink,
  linkedin: FaLinkedin,
  location: FaMapMarkerAlt,
  mail: FaEnvelope,
  menu: FaBars,
  phone: FaPhone,
  power: FaPowerOff,
  quote: FaQuoteLeft,
  rocket: FaRocket,
  share: FaShareNodes,
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
