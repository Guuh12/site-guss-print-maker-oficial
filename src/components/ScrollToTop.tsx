import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isMobile]);

  return null;
};

export default ScrollToTop;
