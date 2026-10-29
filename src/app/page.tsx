import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import About from '@/components/About';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/fx/WhatsAppFab';

export default function Home() {
  return (
    <main className="relative isolate">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Process />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFab />
    </main>
  );
}
