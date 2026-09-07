import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-black/5 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon text-cream font-display text-lg">
            ॐ
          </span>
          <span>
            <span className="block font-display text-lg leading-tight text-slate">Jain Pathshala</span>
            <span className="block text-[10px] tracking-[0.18em] text-slate/50">LEARNING JOURNEY</span>
          </span>
        </Link>

        {user && (
          <nav className="flex items-center gap-6 text-sm text-slate/80">
            <Link to="/" className="flex items-center gap-1.5 hover:text-slate">
              <BookIcon /> Journey
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-slate">Admin</Link>
            )}
            <span className="text-slate">{user.full_name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-maroon hover:text-maroon-dark">
              <LogoutIcon /> Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

function BookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z" />
      <path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
