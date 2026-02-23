import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing-page/Hero";
import Footer from "@/components/layout/Footer";
import Services from "@/components/landing-page/Services";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0c14]">
      <Navbar />
      <main>
        <Hero />
        <Services />
      </main>
      <Footer />
    </div>
  );
}