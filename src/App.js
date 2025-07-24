import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import MobileHeader from './components/MobileHeader';
import MobileBottomMenu from './components/MobileBottomMenu';
import { FavoritesProvider } from './context/FavoritesContext';

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
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <ResponsiveHeader />
          <main className="py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <MobileBottomMenu />
        </div>
      </Router>
    </FavoritesProvider>
  );
}