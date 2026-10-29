import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import NeonDivider from "@/components/NeonDivider";

const Index = () => {
  return (
    <>
      <HeroSection />
      <NeonDivider />
      <FeaturedProducts />
      <HowItWorks />
      <Reviews />
      <FAQ />
    </>
  );
};

export default Index;
