import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Main website sections
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Testimonial from './sections/Testimonial';
import Trips from './sections/Trips';
import Gallery from './sections/Gallery';
import Pricing from './sections/Pricing';
import FAQ from './sections/FAQ';
import ContactAndSignup from './sections/ContactAndSignup';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Main website component
function MainWebsite() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
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

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Main website routes */}
          <Route path="/" element={<MainWebsite />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect /admin/* to /admin for now */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
