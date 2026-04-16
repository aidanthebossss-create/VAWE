import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import About from '@/components/About';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <WaveDivider fromColor="#f8fafb" toColor="#09090b" />
      <Portfolio />
      <WaveDivider fromColor="#09090b" toColor="#f8fafb" flip />
      <Process />
      <About />
      <Pricing />
      <Testimonials />
      <WaveDivider fromColor="#f8fafb" toColor="#09090b" />
      <Contact />
      <Footer />
    </main>
  );
}
