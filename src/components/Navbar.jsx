import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, LogOut, LogIn, UserRound, Search } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location.search]);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/30" />
          <span className="text-white font-semibold tracking-tight group-hover:text-cyan-200 transition-colors">NovaShop</span>
        </Link>

        <form onSubmit={onSearch} className="flex-1 hidden md:flex">
          <div className="flex items-center w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              className="bg-transparent outline-none px-2 text-slate-100 placeholder-slate-400 w-full"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="hidden md:inline-flex px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-200 text-sm border border-cyan-500/40 hover:bg-cyan-500/30 transition">Search</button>
          </div>
        </form>

        <nav className="flex items-center gap-3 ml-auto">
          <Link to="/cart" className="inline-flex items-center gap-2 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="text-slate-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">Orders</Link>
              <button onClick={onLogout} className="inline-flex items-center gap-2 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                <UserRound className="w-5 h-5" />
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
