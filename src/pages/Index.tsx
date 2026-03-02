import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
