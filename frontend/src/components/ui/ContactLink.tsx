import { Phone, Mail, Globe, MapPin, type LucideIcon } from "lucide-react";

export type ContactType = "tel" | "email" | "web" | "address";

const CONFIG: Record<
  ContactType,
  { icon: LucideIcon; href: (v: string) => string; external: boolean }
> = {
  tel: { icon: Phone, href: (v) => `tel:${v.replace(/\s/g, "")}`, external: false },
  email: { icon: Mail, href: (v) => `mailto:${v}`, external: false },
  web: { icon: Globe, href: (v) => (v.startsWith("http") ? v : `https://${v}`), external: true },
  address: {
    icon: MapPin,
    href: (v) => `https://maps.google.com/?q=${encodeURIComponent(v)}`,
    external: true,
  },
};

// Lien de contact cliquable + icône. Ne rend rien si la valeur est vide.
export function ContactLink({ type, value }: { type: ContactType; value?: string | null }) {
  if (!value) return null;
  const { icon: Icon, href, external } = CONFIG[type];
  return (
    <a
      href={href(value)}
      title={value}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-flex items-center gap-1 text-accent transition hover:underline"
    >
      <Icon size={14} />
      <span>{value}</span>
    </a>
  );
}
