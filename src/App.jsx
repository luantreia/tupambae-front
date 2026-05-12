import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AccessibilityProvider from './components/AccessibilityProvider';
import Navbar from './components/Navbar';
import FloatingActionButton from './components/FloatingActionButton';
import ThemeToggle from './components/ThemeToggle';
import Onboarding from './components/Onboarding';
import OnboardingTour from './components/OnboardingTour';
import SkeletonLoader from './components/SkeletonLoader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProducerDetail from './pages/ProducerDetail';
import MyOrders from './pages/MyOrders';
import CreateProduct from './pages/CreateProduct';
import EditProfile from './pages/EditProfile';
import EditUserProfile from './pages/EditUserProfile';
import MisPublicaciones from './pages/MisPublicaciones';
import ExplorarMapa from './pages/ExplorarMapa';
import EditProduct from './pages/EditProduct';
import MisTrueques from './pages/MisTrueques';
import TrustNetwork from './pages/TrustNetwork';
import './styles/animations.css';
import './styles/accessibility.css';
import AccessibilityControls from './components/AccessibilityControls';

function App() {
  const [showTour, setShowTour] = React.useState(false);

  React.useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem('onboarding-completed');
    if (!completed) {
      // Show tour after a short delay to let the app load
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourComplete = () => {
    console.log('Onboarding completed');
  };

  return (
    <AccessibilityProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50/50">
            <a href="#main-content" className="skip-link">
              Saltar al contenido principal
            </a>
            <Navbar />
            <ThemeToggle />
            <Onboarding />
            <OnboardingTour 
              isOpen={showTour}
              onClose={() => setShowTour(false)}
              onComplete={handleTourComplete}
            />
            <main id="main-content" className="container mx-auto px-4 py-8 md:py-12">
              <Suspense fallback={<div className="text-center py-20">Cargando aplicación...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explorar" element={<ExplorarMapa />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/productor/:id" element={<ProducerDetail />} />
                  <Route path="/mis-pedidos" element={<MyOrders />} />
                  <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
                  <Route path="/crear-producto" element={<CreateProduct />} />
                  <Route path="/editar-producto/:id" element={<EditProduct />} />
                  <Route path="/editar-perfil" element={<EditProfile />} />
                  <Route path="/editar-perfil-usuario" element={<EditUserProfile />} />
                  <Route path="/mis-trueques" element={<MisTrueques />} />
                  <Route path="/red-de-confianza" element={<TrustNetwork />} />
                </Routes>
              </Suspense>
            </main>
            <FloatingActionButton />
            <AccessibilityControls />
          </div>
        </Router>
      </ErrorBoundary>
    </AccessibilityProvider>
  );
}

export default App;
