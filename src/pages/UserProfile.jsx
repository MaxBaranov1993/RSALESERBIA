import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getUserProducts } from '../data/userProductsData';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdNum = parseInt(userId);
    const userData = getUserById(userIdNum);
    const products = getUserProducts(userIdNum);
    
    setUser(userData);
    setUserProducts(products);
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('userProfile.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('userProfile.userNotFound')}</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            {t('userProfile.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← {t('userProfile.backToHome')}
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              {t('userProfile.userProfile')}
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ {t('userProfile.verified')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">{t('userProfile.username')}</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('userProfile.location')}</p>
                    <p className="font-medium">{user.location.city}, {user.location.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('userProfile.rating')}</p>
                    <div className="flex items-center">
                      <span className="font-medium">{user.rating}</span>
                      <span className="text-gray-500 ml-1">({user.reviewsCount} {t('userProfile.reviews')})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('userProfile.memberSince')}</p>
                    <p className="font-medium">{formatDate(user.joinDate)}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">{t('userProfile.bio')}</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>

                {/* Stats */}
                <div className="flex space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.productsCount}</p>
                    <p className="text-sm text-gray-500">{t('userProfile.products')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{user.favoritesCount}</p>
                    <p className="text-sm text-gray-500">{t('userProfile.favorites')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Products Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('userProfile.userProducts')} ({userProducts.length})
            </h3>
          </div>
          
          {userProducts.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {userProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">{t('userProfile.noProductsYet')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 