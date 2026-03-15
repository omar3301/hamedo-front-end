import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgress() {
  const location  = useLocation();
  const [width,   setWidth]   = useState(0);
  const [visible, setVisible] = useState(false);
  const timer     = useRef(null);
  const done      = useRef(false);

  useEffect(() => {
    // Start progress bar on every route change
    done.current = false;
    setVisible(true);
    setWidth(0);

    // Quick jump to 30% immediately, then crawl to 85%
    requestAnimationFrame(() => {
      setWidth(30);
      timer.current = setTimeout(() => {
        if (!done.current) setWidth(70);
        timer.current = setTimeout(() => {
          if (!done.current) setWidth(85);
        }, 400);
      }, 80);
    });

    // After a short delay simulate completion
    const finish = setTimeout(() => {
      done.current = true;
      setWidth(100);
      setTimeout(() => setVisible(false), 300);
    }, 500);

    return () => {
      clearTimeout(timer.current);
      clearTimeout(finish);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div style={{
      position:   "fixed",
      top:        0,
      left:       0,
      width:      `${width}%`,
      height:     "3px",
      background: "#F4C430",
      zIndex:     9999,
      transition: width === 100
        ? "width .2s ease, opacity .3s ease"
        : "width .4s cubic-bezier(.4,0,.2,1)",
      opacity:    width === 100 ? 0 : 1,
      pointerEvents: "none",
    }} />
  );
}
