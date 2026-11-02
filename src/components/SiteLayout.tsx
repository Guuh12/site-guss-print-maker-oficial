import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { useSiteMode } from "@/vitrine/siteMode";
import { VitrineBanner, VitrineWhatsAppFloat } from "@/vitrine/VitrineChrome";

const SiteLayout = () => {
  const { isVitrine } = useSiteMode();

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="relative z-10">
        {isVitrine && <VitrineBanner />}
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="loading-retro" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <VitrineWhatsAppFloat />
    </div>
  );
};

export default SiteLayout;
