import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import UserProfile from './pages/UserProfile';
import UsersList from './pages/UsersList';
import Recommendations from './pages/Recommendations';
import ServiceRecommendations from './pages/ServiceRecommendations';
import AddItem from './pages/AddItem';
import AddProduct from './pages/AddProduct';
import AddService from './pages/AddService';
import RegisterWithProduct from './pages/RegisterWithProduct';
import MobileHeader from './components/MobileHeader';
import MobileBottomMenu from './components/MobileBottomMenu';
import Breadcrumbs from './components/Breadcrumbs';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

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
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <ResponsiveHeader />
              <Breadcrumbs />
              <main className="flex-1 py-2 md:py-2 lg:py-2">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/service-recommendations" element={<ServiceRecommendations />} />
                  <Route path="/add" element={<AddItem />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/add-service" element={<AddService />} />
                  <Route path="/register-with-product" element={<RegisterWithProduct />} />
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductPage />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/users" element={<UsersList />} />
                </Routes>
              </main>
              <MobileBottomMenu />
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}