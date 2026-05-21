import { useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";

type PageMetaProps = {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
};

export function PageMeta({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}: PageMetaProps) {
  useEffect(() => {
    const pageTitle = `${title} | ${siteConfig.appName}`;
    document.title = pageTitle;

    const head = document.head;

    const updateMeta = (selector: string, attrs: Record<string, string>) => {
      let element = head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!element) {
        const tagName = selector.startsWith("link") ? "link" : "meta";
        element = document.createElement(tagName) as HTMLMetaElement | HTMLLinkElement;
        head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    };

    updateMeta('meta[name="description"]', {
      name: "description",
      content: description || siteConfig.defaultDescription,
    });

    updateMeta('meta[name="keywords"]', {
      name: "keywords",
      content: keywords || "charity, donation, community support, NGO, animal welfare, local support, crowdfunding, transparency",
    });

    updateMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });

    updateMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description || siteConfig.defaultDescription,
    });

    updateMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });

    updateMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    updateMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });

    updateMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description || siteConfig.defaultDescription,
    });

    if (image) {
      updateMeta('meta[property="og:image"]', {
        property: "og:image",
        content: image,
      });
      updateMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: image,
      });
    }

    const canonicalHref = url || window.location.href;
    let canonical = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);
  }, [title, description, keywords, image, url, type]);

  return null;
}
