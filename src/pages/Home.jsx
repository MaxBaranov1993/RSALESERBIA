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
    <div className="container mx-auto px-4">
      <CategoriesBar />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
