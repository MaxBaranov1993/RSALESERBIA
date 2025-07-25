import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoriesBar from '../components/CategoriesBar';
import { getRandomProducts } from '../data/productsData';

export default function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Получаем случайные товары при загрузке компонента
    const randomProducts = getRandomProducts(8);
    setProducts(randomProducts);
  }, []);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <CategoriesBar />
      <div className="mt-6 sm:mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
