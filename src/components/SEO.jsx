import { useEffect } from "react";

const SITE_NAME = "HamedoSport";
const DEFAULT_IMG = "https://i.ibb.co/cKDd9XNZ/Whats-App-Image-2026-03-09-at-7-40-33-PM.jpg";
const DEFAULT_DESC = "Official Padel and Football kits in Egypt. BullPadel, NOX, Siux. Cash on Delivery.";

function setMeta(name, content, prop = false) {
  const attr = prop ? `property="${name}"` : `name="${name}"`;
  let el = document.querySelector(`meta[${attr}]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(prop ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function SEO({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Official Padel & Football Kits`;
    const desc  = description || DEFAULT_DESC;
    const img   = image || DEFAULT_IMG;

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:title",       fullTitle, true);
    setMeta("og:description", desc,      true);
    setMeta("og:image",       img,       true);
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image",       img);
  }, [title, description, image]);

  return null;
}
