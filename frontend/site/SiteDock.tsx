import { useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import { copy, type CopyKey, type SiteLocale } from "./copy";
import { FacebookIcon, MailIcon, ViberIcon, YouTubeIcon } from "./social-icons";
import { SITE_SOCIAL_HREFS } from "./social-links";

const DOCK_ITEMS: {
  key: CopyKey;
  href: string;
  Icon: () => JSX.Element;
  hoverClass: string;
}[] = [
  {
    key: "dockMail",
    href: SITE_SOCIAL_HREFS.mail,
    Icon: MailIcon,
    hoverClass: "hover:text-tick",
  },
  {
    key: "dockFacebook",
    href: SITE_SOCIAL_HREFS.facebook,
    Icon: FacebookIcon,
    hoverClass: "hover:text-[#1877F2]",
  },
  {
    key: "dockYouTube",
    href: SITE_SOCIAL_HREFS.youtube,
    Icon: YouTubeIcon,
    hoverClass: "hover:text-[#FF0000]",
  },
  {
    key: "dockViber",
    href: SITE_SOCIAL_HREFS.viber,
    Icon: ViberIcon,
    hoverClass: "hover:text-[#7360F2]",
  },
];

function readLocale(): SiteLocale {
  return document.documentElement.lang === "my" ? "my" : "en";
}

function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>(readLocale);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      setLocale(readLocale());
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  return locale;
}

function DockLinks({
  className,
  locale,
}: {
  className: string;
  locale: SiteLocale;
}) {
  const reduceMotion = useReducedMotion();
  const strings = copy[locale];

  return (
    <nav className={className}>
      {DOCK_ITEMS.map((item) => (
        <motion.a
          className={`text-ink inline-flex ${item.hoverClass}`}
          href={item.href}
          key={item.key}
          aria-label={strings[item.key]}
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        >
          <item.Icon />
        </motion.a>
      ))}
    </nav>
  );
}

export function SiteDock() {
  const locale = useSiteLocale();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastScroll = useRef(0);
  const offset = useMotionValue(0);
  const y = useSpring(offset, { stiffness: 220, damping: 26, mass: 0.4 });
  const [footerMount, setFooterMount] = useState<Element | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) {
      return;
    }
    let mount = footer.querySelector("[data-site-social-footer]");
    if (!mount) {
      mount = document.createElement("div");
      mount.setAttribute("data-site-social-footer", "");
      mount.className = "lg:hidden";
      footer.insertBefore(mount, footer.firstChild);
    }
    setFooterMount(mount);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScroll.current;
    lastScroll.current = latest;
    if (reduceMotion) {
      offset.set(0);
      return;
    }
    const delta = latest - previous;
    offset.set(Math.max(-12, Math.min(12, delta * 0.35)));
    requestAnimationFrame(() => {
      offset.set(0);
    });
  });

  return (
    <>
      <div className="pointer-events-none fixed inset-y-0 right-3 z-20 hidden items-center lg:flex">
        <motion.div
          className="border-rule bg-wash pointer-events-auto rounded-full border"
          initial={reduceMotion ? false : { x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ y }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <DockLinks
            className="flex flex-col items-center gap-3 px-2 py-3"
            locale={locale}
          />
        </motion.div>
      </div>
      {footerMount
        ? createPortal(
            <DockLinks
              className="mb-2 flex justify-center gap-4 lg:hidden"
              locale={locale}
            />,
            footerMount,
          )
        : null}
    </>
  );
}
