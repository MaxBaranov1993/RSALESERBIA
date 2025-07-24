import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import MobileHeader from './components/MobileHeader';
import MobileBottomMenu from './components/MobileBottomMenu';
import Breadcrumbs from './components/Breadcrumbs';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider } from './context/LanguageContext';

function ResponsiveHeader() {
  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <ResponsiveHeader />
            <Breadcrumbs />
            <main className="py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
              </Routes>
            </main>
            <MobileBottomMenu />
          </div>
        </Router>
      </FavoritesProvider>
    </LanguageProvider>
  );
}