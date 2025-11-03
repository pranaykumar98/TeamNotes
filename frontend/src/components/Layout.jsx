import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";


export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      <main className="pt-20 pb-20 mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
