import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

function Home({ user, onAdd }) {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const q = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
        const data = await res.json();
        setProducts(data.items || []);
      } catch (e) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <Hero />
      <section id="products" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-2xl font-semibold">Featured products {q ? `(search: ${q})` : ""}</h2>
        </div>

        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={(prod) => onAdd(prod)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      onLogin(data);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Welcome back</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <input className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500">Login</button>
      </form>
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      if (!res.ok) throw new Error("Registration failed");
      await res.json();
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Create your account</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <input className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500">Sign up</button>
      </form>
    </div>
  );
}

function Cart({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const uid = user?.id || "guest";
      const res = await fetch(`${API_BASE}/api/cart/${uid}`);
      const data = await res.json();
      setItems(data.items || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const updateQty = async (itemId, quantity) => {
    await fetch(`${API_BASE}/api/cart/${itemId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quantity }) });
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const removeItem = async (itemId) => {
    await fetch(`${API_BASE}/api/cart/${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Your cart</h2>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <img src={i.product?.image_url} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{i.product?.title}</div>
                    <div className="text-slate-400 text-sm">${i.product?.price?.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(i.id, Math.max(1, i.quantity - 1))} className="px-2 py-1 rounded bg-slate-800">-</button>
                      <span>{i.quantity}</span>
                      <button onClick={() => updateQty(i.id, i.quantity + 1)} className="px-2 py-1 rounded bg-slate-800">+</button>
                      <button onClick={() => removeItem(i.id)} className="ml-4 text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button onClick={() => navigate("/checkout")} className="mt-3 w-full py-2 rounded-lg bg-cyan-600 text-white">Proceed to checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Checkout({ user }) {
  const [form, setForm] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    cardholder_name: "",
    card_number: "",
    expiry: "",
    cvc: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      user_id: user?.id || "guest",
      shipping: {
        full_name: form.full_name,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
      },
      payment: {
        cardholder_name: form.cardholder_name,
        card_number: form.card_number,
        expiry: form.expiry,
        cvc: form.cvc,
      },
    };
    const res = await fetch(`${API_BASE}/api/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      navigate(`/order-success/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="font-medium text-slate-300">Shipping address</div>
            {[
              ["full_name", "Full name"],
              ["address_line1", "Address line 1"],
              ["address_line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["postal_code", "Postal code"],
              ["country", "Country"],
            ].map(([key, label]) => (
              <input key={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800" placeholder={label} />
            ))}
          </div>
          <div className="space-y-3">
            <div className="font-medium text-slate-300">Payment details</div>
            {[
              ["cardholder_name", "Cardholder name"],
              ["card_number", "Card number"],
              ["expiry", "MM/YY"],
              ["cvc", "CVC"],
            ].map(([key, label]) => (
              <input key={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800" placeholder={label} />
            ))}
            <button disabled={loading} className="w-full py-2 rounded-lg bg-cyan-600 text-white">{loading ? "Processing..." : "Pay now"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/orders/${user?.id || "guest"}`);
      const data = await res.json();
      setOrders(data.items || []);
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Your orders</h2>
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o.id.slice(-6)}</div>
                <div className="text-slate-300">${o.total?.toFixed(2)}</div>
              </div>
              <div className="text-slate-400 text-sm">{o.items?.length} items • {o.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-center">
        <div className="text-3xl font-semibold mb-2">Payment successful 🎉</div>
        <div className="text-slate-400">Your order is on the way.</div>
      </div>
    </div>
  );
}

function Layout() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const onLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const onLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const onAdd = async (product) => {
    const uid = user?.id || "guest";
    await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: uid, product_id: product.id, quantity: 1 }),
    });
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} onAdd={onAdd} />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart user={user} />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
