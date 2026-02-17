import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * SEO Component
 * Dynamically updates document title and meta tags for better SEO
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}) => {
  useEffect(() => {
    // Update title
    const fullTitle = title
      ? `${title} | Eventic`
      : "Eventic | Africa's Premier Awards & Events Platform";
    document.title = fullTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description ||
          "Eventic is the leading platform for organizers to manage awards and events. Discover, vote, and celebrate excellence.",
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        keywords || "awards, events, voting, ticketing, eventic",
      );
    }

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", fullTitle);
    }

    // Update OG description
    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    );
    if (ogDescription) {
      ogDescription.setAttribute(
        "content",
        description ||
          "Discover and vote for your favorite nominees on Eventic.",
      );
    }

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", window.location.href);
    }

    // Update OG Type
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute("content", type);
    }

    // Update OG Image
    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute("content", image);
      }
    }

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", window.location.href);
    }
  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};

export default SEO;
