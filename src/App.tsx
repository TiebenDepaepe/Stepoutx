import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Features from './sections/Features';
import About from './sections/About';
import Testimonial from './sections/Testimonial';
import Trips from './sections/Trips';
import Gallery from './sections/Gallery';
import Pricing from './sections/Pricing';
import FAQ from './sections/FAQ';
import ContactAndSignup from './sections/ContactAndSignup';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Testimonial />
        <Trips />
        <Gallery />
        <Pricing />
        <FAQ />
        <ContactAndSignup />
      </main>
      <Footer />
    </div>
  );
}

export default App;
