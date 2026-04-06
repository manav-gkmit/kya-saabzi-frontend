import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen text-[var(--color-text-main)] selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)]">
      {!isAuthPage && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 transition-all duration-300">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-rose-500/30 text-white font-display font-bold text-xl">
                K
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[var(--color-text-main)]">
                Kya Saabzi
              </span>
            </Link>

            <div className="hidden md:flex items-center justify-center px-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/10 bg-[var(--color-primary-light)]/55 px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
                Family meal planning, without the clutter
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 font-sans text-sm font-semibold text-[var(--color-text-muted)]">
              {user ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
                >
                  Sign out
                </button>
              ) : (
                <div className="flex gap-4 items-center">
                  <Link to="/login" className="hover:text-[var(--color-text-main)] transition-colors">Log in</Link>
                  <Link to="/register" className="btn-primary py-2 px-5 text-sm">Sign up free</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className={`relative z-10 ${isAuthPage ? "flex items-center justify-center min-h-screen p-4" : "max-w-6xl mx-auto px-4 md:px-8 pb-20"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
