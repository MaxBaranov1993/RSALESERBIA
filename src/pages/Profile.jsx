import UserProfile from '../components/UserProfile';

export default function Profile() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>
      <div className="max-w-2xl mx-auto">
        <UserProfile />
      </div>
    </div>
  );
}