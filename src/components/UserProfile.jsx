export default function UserProfile() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          <span className="text-3xl">👤</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Иван Иванов</h2>
          <p className="text-gray-600">ivan@example.com</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Мои заказы</h3>
        <div className="space-y-2">
          <p className="text-gray-600">Нет завершенных заказов</p>
        </div>
      </div>
      
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
        Выйти
      </button>
    </div>
  );
}