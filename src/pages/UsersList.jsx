import React from 'react';
import { Link } from 'react-router-dom';
import { usersData } from '../data/usersData';
import { useLanguage } from '../context/LanguageContext';

const UsersList = () => {
  const { t } = useLanguage();

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
              {t('usersList.title')}
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersData.map((user) => (
            <Link 
              key={user.id} 
              to={`/user/${user.id}`}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      {user.isVerified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ {t('userProfile.verified')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{t('userProfile.location')}:</span>
                    <span className="ml-1">{user.location.city}, {user.location.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{t('userProfile.rating')}:</span>
                    <span className="ml-1">{user.rating} ({user.reviewsCount} {t('userProfile.reviews')})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{t('userProfile.memberSince')}:</span>
                    <span className="ml-1">{formatDate(user.joinDate)}</span>
                  </div>
                </div>

                <div className="flex space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{user.productsCount}</p>
                    <p className="text-gray-500">{t('userProfile.products')}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-600">{user.favoritesCount}</p>
                    <p className="text-gray-500">{t('userProfile.favorites')}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList; 