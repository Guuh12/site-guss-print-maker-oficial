import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

const SiteLayout = () => (
  <div className="min-h-screen bg-background">
    <StarField />
    <Navbar />
    <div className="relative z-10">
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
  </div>
);

export default SiteLayout;
