const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export const siteConfig = {
  appName: clean(import.meta.env.VITE_APP_NAME) || "Support Kindness",
  tagline: clean(import.meta.env.VITE_APP_TAGLINE) || "Community Support",
  supportEmail: clean(import.meta.env.VITE_SUPPORT_EMAIL),
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
  contactFormReceiverEmail: clean(import.meta.env.VITE_CONTACT_FORM_RECEIVER_EMAIL),
  phone: clean(import.meta.env.VITE_PHONE_NUMBER),
  whatsappNumber: clean(import.meta.env.VITE_WHATSAPP_NUMBER),
  whatsapp: clean(import.meta.env.VITE_WHATSAPP_URL),
  instagram: clean(import.meta.env.VITE_INSTAGRAM_URL),
  facebook: clean(import.meta.env.VITE_FACEBOOK_URL),
  twitter: clean(import.meta.env.VITE_X_URL),
  linkedin: clean(import.meta.env.VITE_LINKEDIN_URL),
  youtube: clean(import.meta.env.VITE_YOUTUBE_URL),
  address: clean(import.meta.env.VITE_ADDRESS),
  googleMap: clean(import.meta.env.VITE_GOOGLE_MAP_URL),
  website: clean(import.meta.env.VITE_WEBSITE_URL),
  defaultDescription:
    clean(import.meta.env.VITE_SITE_DESCRIPTION) ||
    "A community support initiative focused on animal help, food distribution, tree plantation, and transparent local impact.",
};

export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export const getMailTo = (email: string) => (email ? `mailto:${email}` : "");
export const getTelLink = (phone: string) => (phone ? `tel:${phone.replace(/\s+/g, "")}` : "");
